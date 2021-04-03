import { IFriend, IMessage } from "../../interfaces/data-models";

export default class Friend{
    private friends : IFriend[] = [];
    private activeFriendId: any = null
    private selectedFriend: IFriend = {} as any;
    private addedMessage : any = {};
    private messageRandom = false;
    //getters
    public getFriend(id : string, all ?:boolean){
        if(all) return this.friends;
        const idx = this.friends.findIndex(f => f.id === id)
        if(idx > -1) return this.friends[idx]
        return null
    }
    public getMessage(friendId :string, messageId ?: string){
        const friend  = this.getFriend(friendId) as IFriend
        if(friend){
            const messages = friend.Messages;
            if(messageId){
                return messages.find(m => m.id === messageId)
            }
            return messages;
        }
    }
    public getActiveFriend(){
        return this.activeFriendId;
    }

    public getSelectedFriend() {
        return this.selectedFriend;
    }

    //setters
    public setMessageStatus(friendId : string, messageId : string, status : string){
        const message = this.getMessage(friendId, messageId) as IMessage
        if(message){
            message.status = status
        }
        return this
    }
    public setFriendActive(id : string){
        this.activeFriendId = id;
        this.selectedFriend = this.getFriend(id, false) as IFriend;
        if(this.addedMessage[id]){
            delete this.addedMessage[id]
            this.addedMessage = { ...this.addedMessage, id : Date().valueOf()}
        }            
        return this;
    }
    public addFriends(friends : IFriend[]){
        friends.forEach(f => this.addFriend(f))
        return this
    }
    public addFriend(friend : IFriend){
        friend.count = 0;
        this.friends.push(friend)
        return this
    }
    public removeFriend(id : string){
        const idx = this.friends.findIndex(f => f.id === id)
        if(idx > -1){
            this.selectedFriend = {} as any;
            this.activeFriendId = null;
            this.friends.splice(idx, 1) 
            return true
        }
        return false
    }
    public addMessage(friendId : string, message :IMessage){
        const friend = this.getFriend(friendId) as IFriend
        if(friend){
            friend.Messages.push(message)
            this.messageRandom = false
            friend.count  = (friend.count || 0) +1;
            if(this.selectedFriend.id !== friend.id){
                const friendId = this.addedMessage[friend.id];
                const newFriendId : any = {};
                newFriendId[friend.id] = friendId > -1 ? this.addedMessage[friend.id] + 1 : 1
                this.addedMessage = { ...this.addedMessage,  ...newFriendId, id : Date().valueOf()}
            }else{
                this.addedMessage = { ...this.addedMessage, id : Date().valueOf()}
            }
        }
        return this
    }
    public initMessages(friendId: string, messages: IMessage[], count :number) {
        const friend = this.getFriend(friendId) as IFriend
        if(friend){
            friend.Messages = [...friend.Messages, ...messages];
            this.addedMessage = { ...this.addedMessage, id : Date().valueOf()}
            friend.count = count;
            friend.init = messages.length > 0;
            this.messageRandom = true
        }
        return this
    }
    public updateStatus(id : string, status : boolean){
        const friend = this.getFriend(id) as IFriend
        if(friend){
            friend.status = status;
        }
        return this
    }
    public addMessages(friendId : string, messages :IMessage[]){
        messages.forEach((message : IMessage) => this.addMessage(friendId, message))
        return this
    }
    public combineAll(functions : any[], args : any[]){
        functions.forEach(f => (this as any)[f](...args))
        return this
    }
}
export class _Friend{
    public createFriend(id : string, name : string, image ?:any) : IFriend{
        return {
            Messages : [],
            id : id,
            name : name,
            image : image,
            status : false
        }
    }
}
export class Message{
    public createMessage(id : string, ownerId : string, friendId : string, date : string, message : string, status : string) : IMessage{
        return {
            id : id,
            ownerId : ownerId,
            friendId : friendId,
            createdAt : date,
            message : message,
            status : status
        }
    }
}