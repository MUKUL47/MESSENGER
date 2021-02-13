import mysql, { MysqlError } from 'promise-mysql'
import tables from './tables'
import { IMysql } from '../../interfaces/models.if';
import { response } from 'express';
import logger from '../../utils/logger.util';
export let connection : IMysql;
export class Mysql{
    public initializeMysql() : Promise<void | string>{
        return new Promise(async (resolve, reject) => {
            try{
                connection = await mysql.createConnection({
                    host: process.env.host,
                    user: process.env.user,
                    password: process.env.DB_PASS
                }) as any;
                await Promise.all(tables.map((table : string) => connection.query(table)));
                logger.info('-Initialized mysql-')
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

    public static getUser(id : string): Promise<any>{
        return new Promise((resolve, reject) => {
            connection.query(`SELECT users.id as userId, users.updated_at as updatedAt, users.created_at as createdAt, identity FROM users WHERE id='${id}'`, (err : MysqlError, results : any[]) => {
                if(err){
                    reject(err.message)
                    return
                }
                resolve(results)
            })
        })
    }

    public static getCurrentUser_register(identity : string, isLogin ?: boolean) : Promise<any>{
        const customQ = 'select users.id as userId, verification.identity as verifyIdentity from users'
        const customQ1 = 'verification on users.identity=verification.identity where'
        const registerQuery =`
        ${customQ} left join 
        ${customQ1} users.identity='${identity}'
        union
        ${customQ} right join 
        ${customQ1} verification.identity='${identity}';
        `
        const loginQuery = `SELECT users.id as userId FROM users WHERE identity='${identity}'`
        return new Promise((resolve, reject) => {
            connection.query(isLogin ? loginQuery : registerQuery , (err : MysqlError, results : any[])=>{
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
                await this.queryPromise(`DELETE FROM verification WHERE identity='${identity}'`);
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

    public static updateProfile(id : string, displayName : string, profileImageUrl ?:string) :  Promise<any>{
        return new Promise((resolve, reject) => {
            const ts : number = new Date().valueOf();
            connection.query(`INSERT INTO profile (userId, name, image_url) 
                VALUES ('${id}', '${displayName}', '${profileImageUrl || null}') 
            ON 
                DUPLICATE KEY UPDATE name='${displayName}'`
            ,(err : MysqlError, results : any[])=>{
                if(err){
                    reject(err.message)
                    return
                }
                resolve(results)
            })
        })
    }

    public static getProfile(id : string | string[]) : Promise<any>{
        return new Promise((resolve, reject) => {
            const custom = typeof id === 'object' ? id.map(i => `userId='${i}'`).join(' OR ') : `userId='${id}'`
            connection.query(`SELECT userId as id, name as displayName FROM profile WHERE ${custom}`, 
            (err : MysqlError, results : any[]) => {
                if(err){
                    reject(err.message)
                    return
                }
                resolve(results)
            })
        })
    }

    public static findUsers(userId : string, name : string, start : number, count : number) : Promise<any> {
        return new Promise(async (resolve, reject) => {
            const globalUserQ = `
            SELECT 
                users.id, 
                users.identity, 
                users.created_at as createdAt, 
                profile.name as displayName
            FROM users 
            INNER JOIN
                profile ON users.id = profile.userId AND 
                profile.userId <> '${userId}' AND
                profile.name LIKE '%${name}%'
            `;
            
            connection.query(`${globalUserQ} ORDER BY profile.name DESC LIMIT ${count || 10} OFFSET ${start || 0}`, 
            (err : MysqlError, results : any[]) => {
                if(err){
                    reject(err.message)
                    return
                }
                resolve(results)
            })
        })
    }

    public static setAction(id : string, targetUserId : string, actionType : string, answer?:string) : Promise<any>{
        return new Promise(async (resolve, reject) => {
            try{
                if(actionType === 'send'){
                    const isInvalid  = await Mysql.queryPromise(`
                    SELECT userId, type FROM social WHERE 
                            userId='${id}' AND targetId='${targetUserId}' 
                            OR 
                            targetId='${id}' AND userId='${targetUserId}' 
                            AND type='FRIEND' OR type='PENDING'
                    `)
                    if(isInvalid[0]?.userId){
                        if(isInvalid[0].type === 'FRIEND'){
                            reject('This user is already your friend')
                        }else{
                            reject('Request already sent')
                        }
                        return
                    }
                    await Mysql.queryPromise(`INSERT INTO social (userId, targetId, type, updatedAt) VALUES 
                    ('${id}', '${targetUserId}', 'PENDING', '${new Date().valueOf()}')`)
                    resolve(true)
                    return
                }
                if(actionType === 'remove' || actionType === 'respond' && answer !== 'accept'){
                    await Mysql.queryPromise(`DELETE FROM social WHERE userId='${id}' AND targetId='${targetUserId}' OR targetId='${id}' AND userId='${targetUserId}'`)
                    resolve(true)
                    return
                }
                if(actionType === 'respond'){
                    const isInvalid  = await Mysql.queryPromise(`SELECT userId FROM social WHERE userId='${targetUserId}' AND targetId='${id}' AND type='PENDING'`)
                    if(isInvalid[0]?.userId){
                        await Mysql.queryPromise(`INSERT INTO social (userId, targetId, type, updatedAt) 
                        VALUES ('${targetUserId}', '${id}', 'FRIEND', '${new Date().valueOf()}')
                        ON 
                            DUPLICATE KEY UPDATE type='FRIEND', updatedAt='${new Date().valueOf()}'
                        
                        `)
                        resolve(true)
                    }
                    return reject('Invalid operation(RESPOND=accept) for this user')
                }
                reject('Invalid action for this user')
            }catch(e){
                reject(e)
            }
        })
    }

    public static getMyNetwork(id : string, type : string, start : number, count : number) : Promise<any>{
        return new Promise(async (resolve, reject) => {
            try{
                let correctRequest = false;
                let q : string;
                if(type === 'requests'){
                    correctRequest = true
                    q = `SELECT userId as id, updatedAt FROM social WHERE targetId='${id}' AND type='PENDING'`
                }
                else if(type === 'sent'){
                    correctRequest = true
                    q = `SELECT targetId as id, updatedAt FROM social WHERE userId='${id}' AND type='PENDING'`
                }
                else if(type === 'friend'){
                    correctRequest = true
                    q = `SELECT userId, targetId, updatedAt FROM social WHERE targetId='${id}' OR userId='${id}' AND type='FRIEND'`
                }
                if(correctRequest){
                    const network = await Mysql.queryPromise(`${q} ORDER BY updatedAt DESC LIMIT ${count || 10} OFFSET ${start || 0}`)
                    return resolve(network)
                }
                return reject(`Invalid network type(${type})`)
            }catch(e){
                reject(e)
            }
        })
    }
}