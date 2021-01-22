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
export default class Server{
    private application : express.Application;
    private port : number | string;
    private accessTypes : string[] = ['messenger-web', 'messenger-mobile']
    constructor(){
        this.application = express();
        this.port = process.env.PORT || 8081;
        this.initalizeMiddlewares()
        dotenv.config()
        logger.info('-Initializing server-')
    }

    private async initializeDb() : Promise<string | void>{
        return new Promise(async (resolve, reject) => {
            try{
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
        this.application.use(new Service().getService())
        logger.info('-Initialized middlewares-')
    }

    public start() : Promise<string>{
        return new Promise(async (resolve, reject) => {
            try{
                await this.initializeDb()
                const server : http.Server = this.application.listen(this.port, () => resolve('Running on port '+this.port))
                logger.info(`-SERVER RUNNING ON PORT ${this.port}-`)
                server.on('error',(e) => reject(`Server failed to start on port ${this.port} ${e}`))
            }catch(e){
                reject(e)
            }
        })
    } 

    private appendBarrier(request : Request, response : Response, next : NextFunction){
        if(!this.accessTypes.includes(request['headers']['type'] as string)){
            return response.status(errorCodesUtil.FORBIDDEN).send(errorProperties.RESTRICTED)
        }
        next()
    }
}