const OpenTok = require('opentok');
const redis = require('../connectRedis');

const roomInfo = (req, res) => {
  const { apiKey, apiSecret, newSession } = req.body;
  const { roomName } = req.params;

  if (!apiKey || !apiSecret || !roomName) {
    return res.status(500).json({ error: 'invalid credentials or room name' });
  }

  const opentok = new OpenTok(apiKey, apiSecret);

  redis.get(roomName, (redisGetError, reply) => {
    if (redisGetError || !reply) {
      res.status(500).json({ error: 'could not retrieve information' });
    } else {
      const sessionId = reply;

      if (sessionId) {
        const token = opentok.generateToken(sessionId);
        return res.json({ sessionId, token });
      } else {
        opentok.createSession(
          { mediaMode: 'routed' },
          (sessionError, session) => {
            if (sessionError) {
              return res.status(500).json({ error: `createSession error ${sessionError}`});
            }

            const sessionId = session.sessionId;
            
            redis.set(roomName, sessionId, (redisSetError, reply) => {
              if (redisSetError) {
                res.status(500).json({ error: 'something went wrong' });
              }
            });

            const token = opentok.generateToken(sessionId);
            return res.json({ sessionId, token });
         }
        );
      }
    }
  });
};

module.exports = {
  roomInfo,
};
