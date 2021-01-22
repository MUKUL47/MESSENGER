import socket, { Server } from 'socket.io'
import express from 'express'
import { Mysql, connection} from '../../database/mySql/mysql.db';
import InputValidatorMiddleware from '../../middlewares/inputvalidator.middleware';
import routes from '../../properties/routes';
export default class LoginRegister{
    private serviceApp : express.Application;
    private io : Server;
    constructor(){
        this.serviceApp = express();
        this.initializeLoginRegister()
        this.io = new socket.Server().listen(Number(`${process.env.PORT}`))
    }
    private initializeLoginRegister(){
    }
    public getRouter(): express.Application{
        return this.serviceApp;
    }
}