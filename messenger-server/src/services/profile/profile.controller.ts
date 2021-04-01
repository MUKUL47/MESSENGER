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
export default class ProfileController extends Controller{
    public static async updateProfile(req : Request, resp : Response){
        try{
            const superUser = req['superUser'] as ISuperUser;
            const { displayName, imageUrl } = req.body;
            const {message} = await Mysql.updateProfile(superUser.userId, displayName);
            if(message){
                return Controller.generateController(resp, errorCodesUtil.BAD_REQUEST, message, req.originalUrl)
            }
            Controller.generateController(resp, errorCodesUtil.SUCCESS, responseProperties.PROFILE_UPDATED, req.originalUrl)
        }catch(e){
            logger.error(`ProfileController updateProfile : ${e}`)
            Controller.generateController(resp, errorCodesUtil.UNKNOWN, errorProperties.UNKNOWN_ERROR, req.originalUrl)
        }
    }

    public static async getProfile(req : Request, resp : Response){
        try{
            const superUser = req['superUser'] as ISuperUser;
            const profile = (await Mysql.getProfile(superUser.userId))
            // if(!profile){
            //     return Controller.generateController(resp, errorCodesUtil.NOT_FOUND, responseProperties.PROFILE_NOT_FOUND, req.originalUrl)
            // }
            Controller.generateController(resp, errorCodesUtil.SUCCESS, {...(profile[0] || {}), ...superUser} || {}, req.originalUrl)
        }catch(e){
            logger.error(`ProfileController getProfile : ${e}`)
            Controller.generateController(resp, errorCodesUtil.UNKNOWN, errorProperties.UNKNOWN_ERROR, req.originalUrl)
        }
    }

    public static async getProfiles(req : Request, resp : Response){
        try{
            const ids = req.body as string[];
            const profile = (await Mysql.getProfile(ids))
            Controller.generateController(resp, errorCodesUtil.SUCCESS, profile, req.originalUrl)
        }catch(e){
            logger.error(`ProfileController getProfile : ${e}`)
            Controller.generateController(resp, errorCodesUtil.UNKNOWN, errorProperties.UNKNOWN_ERROR, req.originalUrl)
        }
    }
}