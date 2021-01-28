import express from 'express'
import { Mysql, connection} from '../../database/mySql/mysql.db';
import AuthService from '../../middlewares/auth.middleware';
import InputValidatorMiddleware from '../../middlewares/inputvalidator.middleware';
import routes from '../../properties/routes';
import ProfileController from './profile.controller';
export default class Profile{
    private serviceApp : express.Application;
    constructor(){
        this.serviceApp = express();
        this.initializeProfile()
    }
    private initializeProfile(){
       this.serviceApp.put(routes.PROFILE, 
        AuthService.authMiddleware, 
        InputValidatorMiddleware.valdiatePost, 
        ProfileController.updateProfile)

        this.serviceApp.post(routes.PROFILE, 
         AuthService.authMiddleware, 
         ProfileController.getProfiles)

       this.serviceApp.get(routes.PROFILE, 
        AuthService.authMiddleware, 
        ProfileController.getProfile)
    }
    public getRouter(): express.Application{
        return this.serviceApp;
    }
}