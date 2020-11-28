const Routes = require('./socketRoutes').SocketRoutes
const MessageRoutes = require('./message/messageRoutes').MessageRoutes
const events = require('./events').Events
exports.io = (io, redisInstance) => (function(){
    const routes = new Routes(redisInstance, io)
    const messageRoutes = new MessageRoutes(io, routes)
    io.on('connection', socket => {
        //redis routes
        console.log('connected',socket.id)
        socket.on(events.ONLINE, id => routes.online(id, socket.id));
        socket.on(events.IS_EVENTS_READY, _ => routes.setEventsReady(socket.id));
        socket.on(events.LOGOUT, () => routes.offline(socket.id))
        socket.on(events.DISCONNECT, () => routes.offline(socket.id));
        socket.on(events.REFRESH_FRIEND_LIST, routes.refreshFriendList);
        socket.on(events.NOTIFY, (...p) => routes.notify(...p, socket));
        socket.on(events.IS_TYPING, routes.isTyping);
        //message routes
        socket.on(events.GET_CONVERSATIONS, (...p) => messageRoutes.getConversations(...p, socket))
        socket.on(events.SEND_MESSAGE, (...p) => messageRoutes.sendMessage(...p, socket))
    });
}());