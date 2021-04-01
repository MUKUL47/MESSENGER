import { Request, Response } from 'express'
import { Mysql } from '../../database/mySql/mysql.db';
import { IRegister } from '../../interfaces/register-login.if'
import errorProperties from '../../properties/error.properties';
import { Controller, ErrorController } from '../../utils/controllers.util';
import errorCodesUtil from '../../utils/error-codes.util';
import { isValidIdentity, generateOtp, generateKey } from '../../utils/helpers.util';
import responseProperties from '../../properties/response.properties';
import AuthService from '../../middlewares/auth.middleware';
import logger from '../../utils/logger.util';
import { ISuperUser } from '../../interfaces/models.if';
import { MongoDB } from '../../database/mongoDb/mongo.db';
export default class SocialController extends Controller{
    public static async search(req : Request, resp : Response){
        try{
            const superUser = req['superUser'] as ISuperUser;
            const headers = req.query as { name : string, start : any , count : any };
            const users = await Mysql.findUsers(superUser.userId, headers.name, headers.start, headers.count)
            Controller.generateController(resp, errorCodesUtil.SUCCESS, users, req.originalUrl)
        }catch(e){
            logger.error(`SocialController search : ${e}`)
            Controller.generateController(resp, errorCodesUtil.UNKNOWN, errorProperties.UNKNOWN_ERROR, req.originalUrl)
        }
    }

    public static async action(req : Request, resp : Response){
        try{
            const superUser = req['superUser'] as ISuperUser;
            const { type, targetUser } = req.params as { type : string, targetUser : any };
            const { answer } = req.query as { answer : string }
            if(targetUser === superUser.userId){
               return Controller.generateController(resp, errorCodesUtil.BAD_REQUEST, 'Invalid action for this user', req.originalUrl)
            }
            else if(type === 'respond' && !answer){
               return Controller.generateController(resp, errorCodesUtil.BAD_REQUEST, 'Answer missing for the response action', req.originalUrl)
            }
            await Mysql.setAction(superUser.userId, targetUser, type, answer)
            if(type === 'remove'){
                await MongoDB.removeMessages(superUser.userId, targetUser)
            }
            Controller.generateController(resp, errorCodesUtil.SUCCESS, 'Action successful', req.originalUrl)
        }catch(e){
            logger.error(`SocialController action : ${e}`)
            Controller.generateController(resp, errorCodesUtil.UNKNOWN, e || errorProperties.UNKNOWN_ERROR, req.originalUrl)
        }
    }

    public static async network(req : Request, resp : Response){
        try{
            const superUser = req['superUser'] as ISuperUser;
            const { type } = req.params as { type : string };
            const { start, count } = req.query as { start : any , count : any };
            const network = await Mysql.getMyNetwork(superUser.userId, type, start, count)
            if(type === 'friend' && network.length > 0){
                network.forEach(users => {
                    users['id'] = users['userId'] === superUser.userId ? users['targetId'] : users['userId']
                    delete users['targetId']
                    delete users['userId']
                })
            }
            Controller.generateController(resp, errorCodesUtil.SUCCESS, network, req.originalUrl)
        }catch(e){
            logger.error(`SocialController network : ${e}`)
            Controller.generateController(resp, errorCodesUtil.UNKNOWN, e || errorProperties.UNKNOWN_ERROR, req.originalUrl)
        }
    }
}