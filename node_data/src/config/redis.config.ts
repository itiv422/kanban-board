import config = require('config');

export const redisOptions = {
    host: process.env.REDIS_HOST || config.get<string>('redis.host'),
    port: Number(process.env.REDIS_PORT) || config.get<number>('redis.port')
};