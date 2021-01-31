import express from 'express'
import logger from '../utils/logger.util';
import LoginRegister from './login-register/login-register.router';
import { MessageServiceController } from './message/message.controller';
import Message from './message/message.service';
import Profile from './profile/profile.router';
import Social from './social/social.router'
export class Service{
    private serviceApp : express.Application;
    constructor(){
        this.serviceApp = express();
        this.initializeServices()
    }
    private initializeServices(){
        logger.info('-Initializing service middlewares-')
        this.serviceApp.use(new LoginRegister().getRouter())
        this.serviceApp.use(new Profile().getRouter())
        this.serviceApp.use(new Social().getRouter())
        this.serviceApp.use(Message.initializeMessageService())
    }
    public getServices() : express.Application{
        return this.serviceApp;
    }
}