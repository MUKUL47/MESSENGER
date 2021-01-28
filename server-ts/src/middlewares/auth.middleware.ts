import jwt from 'jsonwebtoken';
import crypto from 'crypto-js'
import { NextFunction, Response, Request } from 'express';
import { Controller } from '../utils/controllers.util';
import errorCodesUtil from '../utils/error-codes.util';
import errorProperties from '../properties/error.properties';
import { Mysql } from '../database/mySql/mysql.db';
import { ISuperUser } from '../interfaces/models.if';
export default class AuthService extends Controller{
    public static signIn(identity : string, throwError ?:boolean) :string | boolean{
        try{
            return jwt.sign({ id : crypto.SHA256(identity).toString() }, process.env.JWT_SALT, { expiresIn : Number(process.env.JWT_EXP)})
        }catch(e){
            if(throwError){
                throw Error(e)
            }
            return false;
        }
    }

    public static verify(token : string) : Promise<any>{
        return new Promise((resolve, reject) => {
            try{
                jwt.verify(token, process.env.JWT_SALT, (err, decoded : any)=>{
                    if(err){
                        reject(err)
                        return
                    }
                    resolve(decoded.id)
                })
            }catch(e){
                reject(e)
            }
        })
    }

    public static async authMiddleware(request : Request, response : Response, next : NextFunction){
        try{
            const token = request.headers['token'] as string;
            if(!token){
                return Controller.generateController(response, errorCodesUtil.FORBIDDEN, errorProperties.ACCESS_DENIED, request.originalUrl)
            }
            const id = await AuthService.verify(token)
            const user = await Mysql.getUser(id);
            if(user[0]?.userId){
                request['superUser'] = user[0];
                next()
                return
            }
            Controller.generateController(response, errorCodesUtil.UNAUTHORIZED, errorProperties.ACCESS_DENIED, request.originalUrl)
        }catch(e){
            Controller.generateController(response, errorCodesUtil.UNAUTHORIZED, errorProperties.ACCESS_DENIED, request.originalUrl)
        }
    }

    public static async checkProfile(request : Request, response : Response, next : NextFunction){
        try{
            const token = request.headers['type'] as string;
            const superUser = request['superUser'] as ISuperUser;
            const user = await Mysql.getProfile(superUser.userId);
            if(user[0]?.displayName) return next()
            Controller.generateController(response, errorCodesUtil.BAD_REQUEST, errorProperties.PROFILE_NOT_SET, request.originalUrl)
        }catch(e){
            Controller.generateController(response, errorCodesUtil.FORBIDDEN, errorProperties.ACCESS_DENIED, request.originalUrl)
        }
    }

    public static loginInterceptor(request : Request, response : Response, next : NextFunction){
        try{
            request['isLogin'] = true;
            next()
        }catch(e){
            Controller.generateController(response, errorCodesUtil.UNKNOWN, e, request.originalUrl)
        }
    }
}