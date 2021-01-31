import redis, { RedisClient } from 'redis'
import logger from '../../utils/logger.util';
export let redisClient : RedisClient;
export default class RedisInstance{
    constructor(){
        redisClient = redis.createClient({ host : 'redis',
        port: Number(process.env.REDIS_PORT) })
        logger.info('-Initialized redisClient-')
    }

    public static setKey(key : string, value : string) : void {
        redisClient.set(key, value)
    }

    public static getKey(key : string, ignoreError ?: boolean) : Promise<any>{
        return new Promise((resolve, reject) => {
            redisClient.get(key, (err : redis.RedisError, resp : string) => {
                if(err?.message && !ignoreError){
                    return reject(err.message)
                }
                resolve(resp || '')
            })
        })
    }

    public static remove(keys : string[]) : void{
        redisClient.del(...keys)
    }
}