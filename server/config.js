require('dotenv').config();

const config = {
  RedisURI: process.env.REDIS_URI || 'redis://localhost:6379',
  video: {
    apiKey: process.env.API_KEY || '',
    apiSecret: process.env.API_SECRET || '',
  },
};

module.exports = config;
