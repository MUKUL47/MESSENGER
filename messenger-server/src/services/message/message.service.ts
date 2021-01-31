import * as socketIo from 'socket.io'
import express from 'express'
import http from 'http'
import MessageController, { MessageServiceController } from './message.controller'
import messageEventsUtil from '../../utils/message.events.util';
import { ISocket } from '../../interfaces/models.if';
import routes from '../../properties/routes';
import AuthService from '../../middlewares/auth.middleware';
import InputValidatorMiddleware from '../../middlewares/inputvalidator.middleware';
export default class Message{
    private io : socketIo.Server
    constructor(server : http.Server){
        this.io = socketIo.listen(server)
    }
    public initializeMessage(){
       this.io.on(messageEventsUtil.CONNECTION, (socket : ISocket) => new MessageController(socket))
    }

    public static initializeMessageService() : express.Application{
        const app : express.Application = express();
        app.get(
            routes.MESSAGE, 
            AuthService.authMiddleware, 
            AuthService.checkProfile, 
            InputValidatorMiddleware.verifyParameters,
            MessageServiceController.getMessages
        )
        return app
    }
}