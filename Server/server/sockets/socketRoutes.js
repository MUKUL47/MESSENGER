const events = require('./events').Events
class SocketRoutes{
    constructor(redisInstance, socketEmitter){
        this.redisInstance = redisInstance;
        this.socketEmitter = socketEmitter;
    }
    online = async (user, socketId) => {
        // this.redisInstance.set(user.user, 'online');
        console.log('connected-isonline----------------------------------------------------',socketId)
        this.redisInstance.set(socketId, `${user.user}`);
        this.redisInstance.set(user.user, `${socketId}`);
        const activeFriends = await Promise.all(user.friends.map(f => this.getKey(f)))
        console.log('totalkv-activeFriends--',activeFriends)
        this.socketEmitter.emit(events.IS_ONLINE, user.user)
        this.socketEmitter.emit(events.CURRENT_ACTIVE_FRIENDS, activeFriends.filter(u => u.response != null))
     }

    setEventsReady = socketId => this.socketEmitter.to(socketId).emit(events.EVENTS_READY)

    offline = async socketId => {
        console.log('offline--')
        const userId = await this.getKey(socketId);
        if(userId.response == null) return
        [userId.response, socketId].forEach(key => this.redisInstance.del(key))
        this.socketEmitter.emit(events.OFFLINE, userId.response)
        // this.socketEmitter.emit(socketId).disconnect();
    }

    refreshFriendList = response => this.socketEmitter.emit(events.REFRESHED_FRIEND_LIST, { id : response.userId, user : response.id, type : response.typ })
    
    notify = response => this.socketEmitter.emit('onNotify', { id : response.userId, user : response.id, message: response.message })

    isTyping = async response => {
        const friendSocketId = (await this.getKey(response.friendId))['response']
        this.socketEmitter.to(friendSocketId).emit('typing', { id : response.friendId, friendId : response.id})
    }

     getKey = key => {
         return new Promise((resolve, reject) => {
            this.redisInstance.get(key, (err, resp) => {
                resolve({key : key, response : resp ? resp : null})
            })
         })
     }

     getAllKeys = () => {
        return new Promise((resolve, reject) => {
           this.redisInstance.get('*', (err, resp) => {
               if(err){
                   reject(err)
                   return;
               }
               resolve(resp)
           })
        })
     }
}
module.exports.SocketRoutes = SocketRoutes