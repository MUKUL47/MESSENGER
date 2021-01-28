import express from 'express'
import logger from '../utils/logger.util';
import LoginRegister from './login-register/login-register.router';
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
    }
    public getService() : express.Application{
        return this.serviceApp;
    }
}