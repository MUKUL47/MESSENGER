import { IMessage } from "../../interfaces/models.if";
export class MessageChunk{
    public createdAt : string;
    public updatedAt : string;
    public participant : string;
    public messages : IMessage[]; 
    constructor(createdAt : string, updatedAt : string, participant : string, messages : IMessage[]){
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.participant = participant
        this.messages = messages
    }
}
export class Message{
    public author;
    public createdAt;
    public message;
    constructor(author : string, createdAt : string, message : string){
        this.author = author
        this.createdAt = createdAt
        this.message = message
        return this
    }
}