const middlewareService = require('../../middleware')
const messageModel = require('../../../database/messages/messageModel').messageModel
const classes = require('./message.class')
const Message = classes.Message
const MessageChunk = classes.MessageChunk
const events = require('../events').Events

module.exports.MessageRoutes = class MessageRoutes{
    constructor(socketEmitter, redisRoutes){
        this.socketEmitter = socketEmitter;
        this.redisRoutes = redisRoutes;
    }

    getConversations = async (token, participants, socket) => {
        try{
            console.log(participants, token)
            const identity = await middlewareService.authenticator(token)
            const targetId = participants[Math.abs(participants.indexOf(identity.id)-1)]
            const socketId = (await this.redisRoutes.getKey(identity.id))['response']
            console.log('-friendSocketId',socketId)

            messageModel.findOne({participants : { $all : participants }}, (err, resp) => this.socketEmitter.to(socket.id).emit(events.GOT_CONVERSATIONS, { error : err, response : resp, targetId :targetId }))
        }catch(err){
            console.log('----eerr',err)
            if(this.tokenVerificationFailed(err)){
                this.socketEmitter.to(socket.id).emit(events.LOGOUT, { id : requestor })
                return
            }
            this.socketEmitter.to(socket.id).emit(events.GOT_CONVERSATIONS, { error : err })
        }
    } 

    sendMessage = async (sender, token, participants, content, identifier, socket) => {
        try{
            const identityObj = await middlewareService.authenticator(token)
            const mySocketId = (await this.redisRoutes.getKey(identityObj.id))['response']
            const friendId = participants[Math.abs(participants.indexOf(identityObj.id)-1)]
            const friendSocketId = (await this.redisRoutes.getKey(friendId))['response']
            console.log('friendSocketId--',friendSocketId, friendId)

            messageModel.findOne({participants : { $all : participants }}, (err, resp) => {
                if(err){
                    this.socketEmitter.emit(events.SENT_MESSAGE, { error : true, identifier : identifier })
                    return;
                }
                const message = new Message(sender, new Date().toString(), content)
                if(resp){
                    messageModel.updateOne
                    (
                        {_id : resp._id}, 
                        { $push : { messages : message}, $set : { participants : participants, updatedAt : new Date().toString() }}, 
                        (err, resp) => {
                            this.socketEmitter.to(mySocketId).emit(events.SENT_MESSAGE, { error : err, identifier : identifier, id : sender, friendId : friendId })
                            console.log('friendSocketId',friendSocketId)
                            if(!err){
                                this.socketEmitter.to(friendSocketId).emit(events.GOT_MESSAGE, { message : message, friendId : sender })
                            }
                        }
                    )
                    return;
                }
                const messageChunk = new MessageChunk(sender, new Date().toString(), new Date().toString(), [message], participants)
                messageModel.create(messageChunk, (err, resp) => {
                    this.socketEmitter.emit(events.SENT_MESSAGE, { error : err, identifier : identifier })
                })
            })
        }catch(err){
            if(this.tokenVerificationFailed(err)){
                this.socketEmitter.emit(events.LOGOUT, { id : sender })
                return
            }
            this.socketEmitter.emit(events.SENT_MESSAGE, { error : true, identifier : identifier })
        }
    }

    tokenVerificationFailed = err => err && err.message && err.message === 'INVALID TOKEN'
}