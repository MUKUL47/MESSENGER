import express from 'express'
import { Mysql, connection} from '../../database/mySql/mysql.db';
import AuthService from '../../middlewares/auth.middleware';
import InputValidatorMiddleware from '../../middlewares/inputvalidator.middleware';
import routes from '../../properties/routes';
import SocialController from './social.controller';
export default class Social{
    private serviceApp : express.Application;
    constructor(){
        this.serviceApp = express();
        this.initializeSocial()
    }
    private initializeSocial(){

       this.serviceApp.get(
            routes.SOCIAL.search, 
            AuthService.authMiddleware, 
            AuthService.checkProfile, 
            InputValidatorMiddleware.verifyParameters, 
            SocialController.search)

        this.serviceApp.get(
            routes.SOCIAL.action, 
            AuthService.authMiddleware, 
            AuthService.checkProfile, 
            SocialController.action)
        
        this.serviceApp.get(
            routes.SOCIAL.network, 
            AuthService.authMiddleware, 
            AuthService.checkProfile, 
            SocialController.network)

    }
    public getRouter(): express.Application{
        return this.serviceApp;
    }
}