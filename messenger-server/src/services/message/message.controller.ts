import { MongoDB } from '../../database/mongoDb/mongo.db';
import RedisInstance, { redisClient } from '../../database/redis/redis.db';
import { ISocket, IsendMessage, ISuperUser, IRedisData } from '../../interfaces/models.if';
import errorProperties from '../../properties/error.properties';
import { Controller, SocketController } from '../../utils/controllers.util';
import errorCodesUtil from '../../utils/error-codes.util';
import { Request, Response } from 'express'
import logger from '../../utils/logger.util';
import * as MessageEvents from '../../utils/message.events.util';
const events = MessageEvents.default;
export default class MessageController extends SocketController{
    private socket : ISocket
    private identifiers = {
        id : 'id-', //socket id
        select : 'select-', //friendId
        socket : 'socket-' //userId
    }
    constructor(socket : ISocket){
        super()
        this.socket = socket;
        this.initializeListeners()
    }
    private initializeListeners(){
        this.socket.on(events.DISCONNECT, this.disconnect.bind(this))
        this.socket.on(events.ONLINE, this.goOnline.bind(this))
        this.socket.on(events.OFFLINE, this.goOffline.bind(this))
        this.socket.on(events.SEND_MESSAGE, this.sendMessage.bind(this))
        this.socket.on(events.ON_FRIEND_SELECT, this.onFriendSelect.bind(this))
        this.socket.on(events.IS_TYPING, this.isTyping.bind(this))
    }
    private async isTyping(response : any){
        try{
            const { id, friendId } = response
            const isFriendOnlineSocketId = await RedisInstance.getKey(this.identifiers.id+friendId) //friend socket IFF online
            if(isFriendOnlineSocketId){
            const isPairedWithMe = await RedisInstance.getKey(this.identifiers.select+friendId)
                if(isPairedWithMe === id){
                    this.socket.to(isFriendOnlineSocketId).emit(events.TYPED, { friendId : id, timestamp : new Date().valueOf() })//send event to friend telling that paired user is typing
                }
            }
        }catch(e){
            this.catchError(e)
        }
    }
    private async onFriendSelect(response : IRedisData){
        try{
            const { id, friendId } = response.args
            RedisInstance.setKey(this.identifiers.select+id, friendId)
            const isFriendOnlineSocketId = await RedisInstance.getKey(this.identifiers.id+friendId) //friend socket IFF online
            if(isFriendOnlineSocketId){
                this.socket.emit(events.GOT_STATUS, { friendId : friendId, status : true}) //send event to inital sender that user is online
                const isPairedWithMe = await RedisInstance.getKey(this.identifiers.select+friendId)
                if(isPairedWithMe === id){
                    this.socket.to(isFriendOnlineSocketId).emit(events.GOT_STATUS, { friendId : id, status : true })//send event to friend telling that paired user is online
                }
            }
        }catch(e){
            this.catchError(e)
        }     
    }
    private async goOnline(response : IRedisData){
        try{
            RedisInstance.setKey(this.identifiers.socket+this.socket.id, `${response.args}`)
            RedisInstance.setKey(this.identifiers.id+response.args, this.socket.id)
        }catch(e){
            this.catchError(e)
        }
    }
    private disconnect(){
        try{
            this.goOffline(true);
        }catch(e){
            this.catchError(e)
        }
    }
    private async goOffline(sendEvent ? :boolean){
        try{
            const userId = await RedisInstance.getKey(this.identifiers.socket+this.socket.id)
            if(userId){
                if(sendEvent){
                    const selectedFriendId = await RedisInstance.getKey(this.identifiers.select+userId)
                    if(selectedFriendId){
                        const selectedFriendSocket = await RedisInstance.getKey(this.identifiers.id+selectedFriendId)
                        if(selectedFriendSocket){
                            this.socket.to(selectedFriendSocket).emit(events.GOT_STATUS, { friendId : userId, status : false })
                        }
                    }
                }
                RedisInstance.remove([this.identifiers.id+userId, this.identifiers.select+userId])
            }
            RedisInstance.remove([this.identifiers.socket+this.socket.id])
        }catch(e){
            this.catchError(e)
        }
    }
    private async sendMessage(params : IsendMessage){
        try {
            await MongoDB.sendMessage(params.userId, params.targetId, params.message)
            const targetSocketId = await RedisInstance.getKey(this.identifiers.id+params.targetId, true)
            this.socket.to(targetSocketId).emit(events.GOT_MESSAGE, this.sendEvent(events.GOT_MESSAGE, params)) 
            this.socket.emit(events.SENT_MESSAGE, this.sendEvent(events.SENT_MESSAGE, params)) 
        }catch(e){
            this.socket.to(this.socket.id).emit(events.SENT_MESSAGE, this.sendEvent(events.SENT_MESSAGE, params, true))
            this.catchError(e)
        }
    }

    private catchError(e){
        logger.error(`MessageController socketId : ${this.socket.id}`)
        logger.error(`MessageController getStatus : ${e}`)
    }
}

export class MessageServiceController extends Controller{
    public static async getMessages(req : Request, res : Response){
        try{
            const superUser = req['superUser'] as ISuperUser;
            const { targetId } = req.query as { targetId : string }
            const resp =  (await MongoDB.getMessages(superUser.userId, targetId))
            Controller.generateController(res, errorCodesUtil.SUCCESS, (resp || [])[0] || [], req.originalUrl)
        }catch(e){
            Controller.generateController(res, errorCodesUtil.UNKNOWN, errorProperties.UNKNOWN_ERROR, req.originalUrl)
            logger.error(`MessageServiceController getMessages : ${e}`)
        }
    }
}