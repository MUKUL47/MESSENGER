import express from 'express'
import { Mysql, connection} from '../../database/mySql/mysql.db';
import AuthService from '../../middlewares/auth.middleware';
import InputValidatorMiddleware from '../../middlewares/inputvalidator.middleware';
import routes from '../../properties/routes';
export default class Message{
    private serviceApp : express.Application;
    constructor(){
        this.serviceApp = express();
        this.initializeMessage()
    }
    private initializeMessage(){
       
    }
    public getRouter(): express.Application{
        return this.serviceApp;
    }
}