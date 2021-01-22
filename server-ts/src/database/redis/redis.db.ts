import redis, { RedisClient } from 'redis'
export let redisClient : RedisClient;
export default class RedisInstance{
    constructor(){
        redisClient = redis.createClient(process.env.REDIS_PORT)
        this.checkRedis()
    }
    private checkRedis(){
    }
}