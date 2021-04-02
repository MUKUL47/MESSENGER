import { Request, Response } from 'express'
import { Mysql } from '../../database/mySql/mysql.db';
import { IRegister } from '../../interfaces/register-login.if'
import errorProperties from '../../properties/error.properties';
import { Controller, ErrorController } from '../../utils/controllers.util';
import errorCodesUtil from '../../utils/error-codes.util';
import { isValidIdentity, generateOtp, generateKey, isRefreshValid } from '../../utils/helpers.util';
import responseProperties from '../../properties/response.properties';
import AuthService from '../../middlewares/auth.middleware';
import logger from '../../utils/logger.util';
import request from 'request'
import routes from '../../properties/routes';
import crypto from 'crypto-js'
import RedisInstance from '../../database/redis/redis.db';
import { ISuperUser } from '../../interfaces/models.if';
export default class RegisterLoginController extends Controller{
    public async authenticate(request : Request, resp : Response){
        try{
            const { isLogin } = request as any;
            const { identity, otp } = request.body as IRegister;
            if(!isValidIdentity(identity)){
                return Controller.generateController(resp, errorCodesUtil.BAD_REQUEST, errorProperties.INVALID_IDENTIY(identity), request.originalUrl)
            }
            const userVerify =  await Mysql.getCurrentUser_register(identity, isLogin);
            if(!otp){
                const otp : string = process.env.MODE === 'PROD' ? generateOtp() : '123456'
                await Mysql.updateOrAddVerification(identity, otp, isLogin ? 'LOGIN' : 'REGISTER')
                Controller.generateController(resp, errorCodesUtil.SUCCESS, responseProperties.SENT_OTP(identity), request.originalUrl)
                return
            }
            Mysql.verifyOtp(otp, identity). 
                then(async (ans : boolean) => {
                    if(ans){
                        const hashedIdentity = crypto.SHA256(identity).toString();
                        await Mysql.createOrUpdate_user(hashedIdentity, identity)
                        const token = AuthService.signIn(identity, true) as string;
                        const refreshToken : string = generateKey(24);
                        RedisInstance.setKey(`REFRESH-${refreshToken}`, `${refreshToken}-${new Date().valueOf()}-${identity}`)
                        Controller.generateController(resp, userVerify[0]?.userId ? errorCodesUtil.SUCCESS : errorCodesUtil.CREATED, { token : token, refresh_token : refreshToken, id : hashedIdentity }, request.originalUrl)
                    }else{
                        Controller.generateController(resp, errorCodesUtil.FORBIDDEN, errorProperties.INVALID_OTP, request.originalUrl)
                    }
                }). 
                catch((e) => {
                    Controller.generateController(resp, errorCodesUtil.UNKNOWN, e, request.originalUrl)
                })

        }catch(e){
            resp.status(errorCodesUtil.UNKNOWN).send(new ErrorController(errorCodesUtil.UNKNOWN, JSON.stringify(e), request.originalUrl))
        }
    }

    public async authorize(req : Request, resp : Response){
        try{
            const { loginType, token } = req.headers as { loginType : string, token : string };
            if(!token){
                return Controller.generateController(resp, errorCodesUtil.UNAUTHORIZED, errorProperties.UNAUTHORIZED, req.originalUrl)
            }
            const identity = await RegisterLoginController.thirdPartLogin(loginType, token)
            const hashedIdentity = crypto.SHA256(identity).toString();
            const userVerify =  await Mysql.getCurrentUser_register(identity, true);
            const authToken = AuthService.signIn(identity, true) as string;
            const refreshToken : string = generateKey(24);
            RedisInstance.setKey(`REFRESH-${refreshToken}`, `${refreshToken}-${new Date().valueOf()}-${identity}`)
            if(userVerify[0]?.userId){
                return Controller.generateController(resp, errorCodesUtil.SUCCESS , { token : authToken, refresh_token : refreshToken, identity, id :hashedIdentity }, request.originalUrl)
            }
            await Mysql.createOrUpdate_user(hashedIdentity, identity)
            Controller.generateController(resp, errorCodesUtil.CREATED, { token : authToken, refresh_token : refreshToken, identity, id :hashedIdentity }, request.originalUrl)
        }catch(e){
            logger.error(`RegisterLoginController authorize : ${e}`)
            Controller.generateController(resp, errorCodesUtil.UNAUTHORIZED, errorProperties.UNAUTHORIZED, req.originalUrl)
        }
    }

    private static async thirdPartLogin(type : string, token : string) : Promise<any>{
        return new Promise((resolve, reject) => {
            request(routes.GOOGLE, { headers: { Authorization: "Bearer " + token, "content-type": "application/x--www-form-urlencoded"}}, (err, response, body) => {
                try{
                    if(err || response.statusCode !== 200){
                        reject(err)
                        return;
                    }
                    resolve(JSON.parse(body.toString('utf-8'))['emailAddress'])
                }catch(err){
                    console.error(`RegisterLoginController thirdPartLogin : ${err}`)
                    logger.error(`RegisterLoginController thirdPartLogin : ${err}`)
                    reject(err)
                }
            })
        })
    }

    public async logout(request : Request, resp : Response){  
        try{
            const superUser = request['superUser'] as ISuperUser;
            RedisInstance.remove([`REFRESH-${crypto.SHA256(superUser.identity).toString()}`])
            Controller.generateController(resp, errorCodesUtil.SUCCESS, responseProperties.LOGGED_OUT, request.originalUrl)
        }catch(e){
            logger.error(`RegisterLoginController logout : ${e}`)
            Controller.generateController(resp, errorCodesUtil.SUCCESS, null, request.originalUrl)
        }   
    }

    public async refreshToken(request : Request, response : Response){
        try{
            const invalidToken = () => Controller.generateController(response, errorCodesUtil.UNAUTHORIZED, responseProperties.INVALID_REFRESH, request.originalUrl)
            const { token } = request.query as { token : string }
            if(!token) return invalidToken()
            const refreshToken : string = await RedisInstance.getKey(`REFRESH-${token}`)
            if(!refreshToken || refreshToken.split('-')[0] != token || !isRefreshValid(refreshToken.split('-')[1])) return invalidToken()
            RedisInstance.remove([`REFRESH-${token}`])
            const identity = refreshToken.split('-')[2];
            const authToken = AuthService.signIn(identity, true) as string;
            const newRefreshToken : string = generateKey(24);
            RedisInstance.setKey(`REFRESH-${newRefreshToken}`, `${newRefreshToken}-${new Date().valueOf()}-${identity}`)
            Controller.generateController(response, errorCodesUtil.SUCCESS,{ token : authToken, refresh_token : newRefreshToken }, request.originalUrl)
        }catch(e){
            logger.error(`refreshToken refreshToken : ${e}`)
            Controller.generateController(response, errorCodesUtil.UNKNOWN, errorProperties.UNKNOWN_ERROR, request.originalUrl)
        } 
    }
}
