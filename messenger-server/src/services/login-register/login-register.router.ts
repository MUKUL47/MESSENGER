import express from 'express'
import { Mysql, connection} from '../../database/mySql/mysql.db';
import AuthService from '../../middlewares/auth.middleware';
import InputValidatorMiddleware from '../../middlewares/inputvalidator.middleware';
import routes from '../../properties/routes';
import RegisterLoginController from './register-login.controller';
export default class LoginRegister{
    private serviceApp : express.Application;
    constructor(){
        this.serviceApp = express();
        this.initializeLoginRegister()
    }
    private initializeLoginRegister(){
        const registerLoginController = new RegisterLoginController();
        this.serviceApp.post(
            routes.REGISTER, 
            InputValidatorMiddleware.valdiatePost, 
            registerLoginController.authenticate)

        this.serviceApp.post(
            routes.LOGIN,
            AuthService.loginInterceptor,
            InputValidatorMiddleware.valdiatePost,
            registerLoginController.authenticate
        )

        this.serviceApp.get(
            routes.AUTHORIZE,
            // AuthService.authMiddleware,
            registerLoginController.authorize
        )

        this.serviceApp.get(
            routes.LOGOUT,
            AuthService.authMiddleware,
            registerLoginController.logout
        )

        this.serviceApp.get(
            routes.REFRESH,
            registerLoginController.refreshToken
        )
    }
    public getRouter(): express.Application{
        return this.serviceApp;
    }
}