import express, { NextFunction, Request, Response } from 'express'
import http from 'http'
import cors from 'cors'
import bodyparser from 'body-parser'
import { Service } from './services/service'
import errorCodesUtil from './utils/error-codes.util'
import errorProperties from './properties/error.properties'
import { Mysql } from './database/mySql/mysql.db'
import { MongoDB } from './database/mongoDb/mongo.db'
import dotenv from 'dotenv'
import RedisInstance from './database/redis/redis.db'
import logger from './utils/logger.util'
import cluster from 'cluster'
import Message from './services/message/message.service'
export default class Server{
    private application : express.Application;
    private listener : http.Server
    private port : number | string;
    private accessTypes : string[] = ['messenger-web', 'messenger-mobile']
    constructor(){
        this.application = express();
        this.port = process.env.PORT;
        this.initalizeMiddlewares()
        dotenv.config()
        logger.info('-Initializing server-')
    }

    public setPort(port : number){
        this.port = port;
        return this
    }

    private async initializeDb() : Promise<string | void>{
        return new Promise(async (resolve, reject) => {
            try{
                console.log('-Initializing DBS-')
                logger.info('-Initializing DBS-')
                new RedisInstance();
                await new Mysql().initializeMysql();
                await new MongoDB().initializeModel();
                logger.info('-Initialized MongoDB-')
                resolve()
            }catch(e){
                reject(e)
            }
        })
    }

    private initalizeMiddlewares(){
        this.application.use(cors({ origin : '*/*' }))
        this.application.use(bodyparser.urlencoded({ extended : true }))
        this.application.use(bodyparser.json())
        this.application.use(this.appendBarrier.bind(this))
        this.application.use(new Service().getServices())
        logger.info('-Initialized middlewares-')
    }

    public start() : Promise<string>{
        return new Promise(async (resolve, reject) => {
            try{
                await this.initializeDb()
                this.listener = this.application.listen(this.port, () => resolve('Running on port '+this.port+` THREAD ${cluster.worker.id}`))
                new Message(this.listener).initializeMessage()
                logger.info(`-SERVER RUNNING ON PORT ${this.port}`)
                this.listener.on('error',(e) => reject(`Server failed to start on port 555${this.port} ${e}`))
            }catch(e){
                logger.error(`Server start : ${e}`)
                reject(e)
            }
        })
    } 

    public getServerInstance() : http.Server {
        return this.listener;
    }

    private appendBarrier(request : Request, response : Response, next : NextFunction){
        if(!this.accessTypes.includes(request['headers']['type'] as string)){
            return response.status(errorCodesUtil.FORBIDDEN).send(errorProperties.RESTRICTED)
        }
        next()
    }
}