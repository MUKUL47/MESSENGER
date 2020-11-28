module.exports.MessageChunk =  class MessageChunk{
    constructor(owner, createdAt, updatedAt, messages, participants){
        this.owner = owner;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.messages = messages;
        this.participants = participants;
    }
}
module.exports.Message =  class Message{
    constructor(author, createdAt, content){
        this.createdAt = createdAt;
        this.author = author;
        this.content = content;
    }
}