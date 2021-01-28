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
import request from 'request'
import routes from '../../properties/routes';
import crypto from 'crypto-js'
export default class RegisterLoginController extends Controller{
    public async authenticate(request : Request, resp : Response){
        try{
            const { isLogin } = request as any;
            const { identity, otp } = request.body as IRegister;
            if(!isValidIdentity(identity)){
                return Controller.generateController(resp, errorCodesUtil.BAD_REQUEST, errorProperties.INVALID_IDENTIY(identity), request.originalUrl)
            }
            const userVerify =  await Mysql.getCurrentUser_register(identity, isLogin);
            if(!isLogin && userVerify[0]?.userId){
                return Controller.generateController(resp, errorCodesUtil.BAD_REQUEST, errorProperties.USER_EXIST, request.originalUrl)
            }
            else if(isLogin && !userVerify[0]?.userId){
                return Controller.generateController(resp, errorCodesUtil.BAD_REQUEST, errorProperties.USER_NOT_FOUND, request.originalUrl)
            }
            if(!otp){
                const otp : string = process.env.MODE === 'DEV' ? generateOtp() : '123456'
                await Mysql.updateOrAddVerification(identity, otp, isLogin ? 'LOGIN' : 'REGISTER')
                Controller.generateController(resp, errorCodesUtil.SUCCESS, responseProperties.SENT_OTP(identity), request.originalUrl)
                return
            }
            Mysql.verifyOtp(otp, identity). 
                then(async (ans : boolean) => {
                    if(ans){
                        await Mysql.createOrUpdate_user(crypto.SHA256(identity).toString(), identity)
                        const token = AuthService.signIn(identity, true) as string;
                        Controller.generateController(resp, isLogin ? errorCodesUtil.SUCCESS : errorCodesUtil.CREATED, token, request.originalUrl)
                    }else{
                        Controller.generateController(resp, errorCodesUtil.FORBIDDEN, errorProperties.INVALID_OTP, request.originalUrl)
                    }
                }). 
                catch((e) => {
                    Controller.generateController(resp, errorCodesUtil.UNKNOWN, e, request.originalUrl)
                })

        }catch(e){
            resp.status(errorCodesUtil.UNKNOWN).send(new ErrorController(errorCodesUtil.UNKNOWN, e, request.originalUrl))
        }
    }

    public async authorize(req : Request, resp : Response){
        try{
            const { loginType, token } = req.headers as { loginType : string, token : string };
            if(!loginType || !token){
                return Controller.generateController(resp, errorCodesUtil.UNAUTHORIZED, errorProperties.UNAUTHORIZED, req.originalUrl)
            }
            const identity = await this.thirdPartLogin(loginType, token)
            const userVerify =  await Mysql.getCurrentUser_register(identity, true);
            if(userVerify[0]?.userId){
                const authToken = AuthService.signIn(identity, true) as string;
                return Controller.generateController(resp, errorCodesUtil.SUCCESS , authToken, request.originalUrl)
            }
            await Mysql.createOrUpdate_user(generateKey(16), identity)
            const authToken = AuthService.signIn(identity, true) as string;
            Controller.generateController(resp, errorCodesUtil.CREATED, authToken, request.originalUrl)
        }catch(e){
            logger.error(`RegisterLoginController authorize : ${e}`)
            Controller.generateController(resp, errorCodesUtil.UNAUTHORIZED, errorProperties.UNAUTHORIZED, req.originalUrl)
        }
    }

    private async thirdPartLogin(type : string, token : string) : Promise<any>{
        return new Promise((resolve, reject) => {
            request(routes.GOOGLE, { headers: { Authorization: "Bearer " + token, "content-type": "application/x--www-form-urlencoded"}}, (err, response, body) => {
                try{
                    if(err || response.statusCode !== 200){
                        reject(err)
                        return;
                    }
                    resolve(JSON.parse(body.toString('utf-8'))['emailAddress'])
                }catch(err){
                    logger.error(`RegisterLoginController thirdPartLogin : ${err}`)
                    reject(err)
                }
            })
        })
    }

    public async logout(request : Request, resp : Response){
        Controller.generateController(resp, errorCodesUtil.SUCCESS, responseProperties.LOGGED_OUT, request.originalUrl)
    }
}
