import express from 'express'
import LoginRegister from './login-register/login-register.router';
export class Service{
    private serviceApp : express.Application;
    constructor(){
        this.serviceApp = express();
        this.initializeServices()
    }
    private initializeServices(){
        this.serviceApp.use(new LoginRegister().getRouter())
    }
    public getService() : express.Application{
        return this.serviceApp;
    }
}