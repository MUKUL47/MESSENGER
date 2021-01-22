import redis, { RedisClient } from 'redis'
import logger from '../../utils/logger.util';
export let redisClient : RedisClient;
export default class RedisInstance{
    constructor(){
        redisClient = redis.createClient(process.env.REDIS_PORT)
        logger.info('-Initialized redisClient-')
        this.checkRedis()
    }
    private checkRedis(){
    }
}