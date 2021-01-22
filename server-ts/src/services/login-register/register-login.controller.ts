import { Request, Response } from 'express'
import { Mysql } from '../../database/mySql/mysql.db';
import { IRegister } from '../../interfaces/register-login.if'
import errorProperties from '../../properties/error.properties';
import { Controller, ErrorController } from '../../utils/controllers.util';
import errorCodesUtil from '../../utils/error-codes.util';
import { isValidIdentity, generateOtp, generateKey } from '../../utils/helpers.util';
import responseProperties from '../../properties/response.properties';
import AuthService from '../../middlewares/auth.middleware';
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
                        await Mysql.createOrUpdate_user(generateKey(16), identity)
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

    public async logout(request : Request, resp : Response){
        Controller.generateController(resp, errorCodesUtil.SUCCESS, responseProperties.LOGGED_OUT, request.originalUrl)
    }
}
