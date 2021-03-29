import { IFriend, IMessage } from "../../interfaces/data-models";

export default class Friend{
    private friends : IFriend[] = [];
    private activeFriendId: any = null
    private selectedFriend: IFriend = {} as any;
    private addedMessage = -1;
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
        return this;
    }
    public addFriends(friends : IFriend[]){
        friends.forEach(f => this.addFriend(f))
        return this
    }
    public addFriend(friend : IFriend){
        this.friends.push(friend)
        return this
    }
    public removeFriend(id : string){
        const idx = this.friends.findIndex(f => f.id === id)
        if(idx > -1){
            this.friends.splice(idx, 1) 
            return true
        }
        return false
    }
    public addMessage(friendId : string, message :IMessage){
        const friend = this.getFriend(friendId) as IFriend
        if(friend){
            friend.Messages.push(message)
            this.addedMessage = new Date().valueOf()
        }
        return this
    }
    public initMessages(friendId: string, messages: IMessage[]) {
        const friend = this.getFriend(friendId) as IFriend
        if(friend){
            friend.Messages = messages;
            this.addedMessage = new Date().valueOf()
            friend.init = messages.length > 0;
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
            image : image
        }
    }
}
export class Message{
    public createMessage(id : string, ownerId : string, friendId : string, date : string, message : string, status : string) : IMessage{
        return {
            id : id,
            ownerId : ownerId,
            friendId : friendId,
            date : date,
            message : message,
            status : status
        }
    }
}