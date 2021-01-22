import jwt from 'jsonwebtoken';
import crypto from 'crypto-js'
import { NextFunction, Response, Request } from 'express';
import { Controller } from '../utils/controllers.util';
import errorCodesUtil from '../utils/error-codes.util';
import errorProperties from '../properties/error.properties';
export default class AuthService extends Controller{
    public static signIn(identity : string, throwError ?:boolean) :string | boolean{
        try{
            return jwt.sign({ id : crypto.SHA512(identity).toString() }, process.env.JWT_SALT, { expiresIn : Number(process.env.JWT_EXP)})
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
                console.error(e)
                reject(e)
            }
        })
    }

    public static async authMiddleware(request : Request, response : Response, next : NextFunction){
        try{
            const token = request.headers['type'] as string;
            if(!token){
                return Controller.generateController(response, errorCodesUtil.FORBIDDEN, errorProperties.ACCESS_DENIED, request.originalUrl)
            }
            await this.verify(token)
            next()
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