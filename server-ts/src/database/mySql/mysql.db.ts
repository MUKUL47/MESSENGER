import mysql from 'promise-mysql'
import tables from './tables'
import { IMysql } from '../../interfaces/models.if';
let connection : IMysql;
export class Mysql{
    public initializeMysql() : Promise<void | string>{
        return new Promise(async (resolve, reject) => {
            try{
                connection = await mysql.createConnection({
                    host: process.env.host,
                    user: process.env.user,
                    // database: process.env.db,
                    password: process.env.DB_PASS,
                }) as any;
                await Promise.all(tables.map((table : string) => connection.query(table)));
                resolve()
            }catch(e){
                reject(e)
            }
        })
    }
}