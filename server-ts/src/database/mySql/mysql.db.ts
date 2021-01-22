import mysql, { MysqlError } from 'promise-mysql'
import tables from './tables'
import { IMysql } from '../../interfaces/models.if';
import { response } from 'express';
export let connection : IMysql;
export class Mysql{
    public initializeMysql() : Promise<void | string>{
        return new Promise(async (resolve, reject) => {
            try{
                connection = await mysql.createConnection({
                    host: process.env.host,
                    user: process.env.user,
                    password: process.env.DB_PASS,
                }) as any;
                await Promise.all(tables.map((table : string) => connection.query(table)));
                resolve()
            }catch(e){
                reject(e)
            }
        })
    }

    private static queryPromise(query : string) : Promise<any>{
        return new Promise((resolve, reject) => {
            connection.query(query, (err : MysqlError, results : any[]) => {
                if(err){
                    reject(err.message)
                    return
                }
                resolve(results)
            })
        })
    }

    public static getCurrentUser_register(identity : string) : Promise<any>{
        const customQ = 'select users.id as userId, verification.identity as verifyIdentity from users'
        const customQ1 = 'verification on users.identity=verification.identity where'
        return new Promise((resolve, reject) => {
            connection.query(`
            ${customQ} left join 
            ${customQ1} users.identity='${identity}'
            union
            ${customQ} right join 
            ${customQ1} verification.identity='${identity}';
            `,(err : MysqlError, results : any[])=>{
                if(err){
                    reject(err.message)
                    return
                }
                resolve(results)
            })
        })
    }

    public static updateOrAddVerification(identity : string, otp : string, type : string = 'REGISTER'): Promise<any>{
        return new Promise((resolve, reject) => {
            const ts : number = new Date().valueOf();
            connection.query(`INSERT INTO verification (identity, created_at, otp_type, otp) 
                VALUES ('${identity}', '${ts}', '${type}', '${otp}') 
            ON 
                DUPLICATE KEY UPDATE created_at='${ts}', otp='${otp}'`
            ,(err : MysqlError, results : any[])=>{
                if(err){
                    reject(err.message)
                    return
                }
                resolve(results)
            })
        })
    }

    public static verifyOtp(otp : string, identity : string): Promise<any>{
        return new Promise(async (resolve, reject) => {
            try{
                const verificationResp = await this.queryPromise(`select verification.created_at as timestamp from verification where identity='${identity}' AND otp='${otp}'`);
                if(verificationResp[0]?.timestamp){
                    if(Number(verificationResp[0]?.timestamp) + (Number(process.env.OTP_LIMIT_SECONDS) * 1000) < new Date().valueOf()){
                        resolve(false)
                        return
                    }
                    await this.queryPromise(`DELETE FROM verification WHERE identity='${identity}'`);
                    resolve(true)
                }
                resolve(false)
            }catch(e){
                reject(e)
            }
        })
    }

    public static createOrUpdate_user(id : string, identity : string): Promise<any>{
        return new Promise((resolve, reject) => {
            const ts : number = new Date().valueOf();
            connection.query(`INSERT INTO users (id, updated_at, created_at, identity) 
                VALUES ('${id}', '${ts}', '${ts}', '${identity}') 
            ON 
                DUPLICATE KEY UPDATE updated_at='${ts}'`
            ,(err : MysqlError, results : any[])=>{
                if(err){
                    reject(err.message)
                    return
                }
                resolve(results)
            })
        })
    }
}