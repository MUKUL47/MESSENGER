import jwt from 'jsonwebtoken';
import crypto from 'crypto-js'
export default class AuthService{
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

    public static verify(identity : string) : Promise<any>{
        return new Promise((resolve, reject) => {
            try{
                jwt.verify(crypto.SHA512(identity).toString(), process.env.JWT_SALT, (err, decoded : any)=>{
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
}