import { MongoDB } from '../../database/mongoDb/mongo.db';
import RedisInstance from '../../database/redis/redis.db';
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
        status : 'STATUS-',
        select : '-SELECTED'
    }
    constructor(socket : ISocket){
        super()
        this.socket = socket;
        this.initializeListeners()
    }
    private initializeListeners(){
        this.socket.on(events.DISCONNECT, this.disconnect)
        this.socket.on(events.ONLINE, this.goOnline)
        this.socket.on(events.OFFLINE, this.goOffline)
        this.socket.on(events.GET_STATUS, this.getStatus)
        this.socket.on(events.SEND_MESSAGE, this.sendMessage)
        this.socket.on(events.ON_FRIEND_SELECT, this.onFriendSelect)
        this.socket.on(events.IS_TYPING, this.isTyping)
    }
    private async isTyping(response : IRedisData){
        try{
            const targetId = await RedisInstance.getKey(this.identifiers.status+this.socket.id)
            if(targetId){
                this.socket.to(targetId).emit(events.TYPED)
            }
        }catch(e){
            this.catchError(e)
        }
    }
    private onFriendSelect(selectedFriendId : string){
        RedisInstance.setKey(this.socket.id+this.identifiers.select, selectedFriendId)
    }
    private goOnline(){
        RedisInstance.setKey(this.identifiers.status+this.socket.id, this.socket.id)
    }
    private goOffline(){
        RedisInstance.remove([
            this.identifiers.status+this.socket.id, 
            this.socket.id+this.identifiers.select
        ])
    }
    private async getStatus(id : string){
        try{
            const status = await RedisInstance.getKey(this.identifiers.status+id)
            this.socket.to(this.socket.id).emit(events.GOT_STATUS, status)
        }catch(e){
            this.catchError(e)
        }
    }
    private async disconnect(){
        try{
            this.goOffline();
        }catch(e){
            this.catchError(e)
        }
    }
    private async sendMessage(params : IsendMessage){
        try{
            await MongoDB.sendMessage(params.userId, params.targetId, params.message)
            const targetSocketId = await RedisInstance.getKey(params.targetId, true) 
            this.socket.to(targetSocketId).emit(events.GOT_MESSAGE, this.sendEvent(events.GOT_MESSAGE, params)) 
            this.socket.to(this.socket.id).emit(events.SENT_MESSAGE, this.sendEvent(events.SENT_MESSAGE, params)) 
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
            Controller.generateController(res, errorCodesUtil.SUCCESS, (await MongoDB.getMessages(superUser.userId, targetId)) || [], req.originalUrl)
        }catch(e){
            Controller.generateController(res, errorCodesUtil.UNKNOWN, errorProperties.UNKNOWN_ERROR, req.originalUrl)
            logger.error(`MessageServiceController getMessages : ${e}`)
        }
    }
}