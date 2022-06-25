module.exports = (url, database) => {
    const redis = require('redis');
    const redisClient = process.env.NODE_ENV === 'local' ? redis.createClient({database}) : redis.createClient({database, url});
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    return redisClient;
}