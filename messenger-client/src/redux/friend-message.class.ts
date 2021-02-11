import { IFriend, IMessage } from "../interfaces/data-models";

export default class FriendMessages{
    friends : IFriend[]
    constructor(){
        this.friends = []
    }
    //getters
    public getFriendMessages(id : string) : Array<IMessage>{
        const isFriend = this.friends.find(f => f.id === id)
        if(isFriend){
            return isFriend.Messages
        }
        return []
    }

    //setters
    public addFriend(friend : IFriend){
        const isFriend = this.friends.find(f => f.id === friend.id)
        if(isFriend){
            this.friends.splice(isFriend.index, 1)
        }
        this.friends.push({...friend, index : this.friends.length })
    }
    
    public addFriends(friends : IFriend[]) : IFriend[]{
        friends.forEach(friend => this.addFriend(friend))
        return this.friends;
    }

    public addFriendMessages(id : string, ownerId : string, friendId : string, date : string, message : string){
        const friend = this.friends.find(f => f.id === friendId)
        if(friend){
            friend.Messages.push({ id : id, message : message, ownerId : ownerId, date : date || new Date().valueOf().toString(), friendId : friendId })
        }
        return false;
    }
}