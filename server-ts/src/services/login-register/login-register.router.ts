import express from 'express'
import InputValidatorMiddleware from '../../middlewares/inputvalidator.middleware';
import routes from '../../properties/routes';
export default class LoginRegister{
    private serviceApp : express.Application;
    constructor(){
        this.serviceApp = express();
        this.initializeLoginRegister()
    }
    private initializeLoginRegister(){
        this.serviceApp.post(routes.LOGIN, InputValidatorMiddleware.parseJson, InputValidatorMiddleware.valdiatePost)
        this.serviceApp.get(routes.REGISTER,() => console.log('TESTING'))
        this.serviceApp.get(routes.LOGOUT,() => console.log('TESTING'))
    }
    public getRouter(): express.Application{
        return this.serviceApp;
    }
}