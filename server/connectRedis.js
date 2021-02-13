const Redis = require('ioredis');
const config = require('./config');

const CONNECT_REDIS_TIMEOUT = 5000;

const redis = new Redis(
  config.RedisURI,
  { connectTimeout: CONNECT_REDIS_TIMEOUT },
);

const connectRedisTimeoutInterval = setInterval(() => {
  throw new Error(`redis connection timed out`);
}, CONNECT_REDIS_TIMEOUT);

redis.on('ready', () => {
  console.log('successfully connected to redis and db is ready');
  clearInterval(connectRedisTimeoutInterval);
});

module.exports = redis;
