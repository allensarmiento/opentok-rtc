const express = require('express');
const bodyParser = require('body-parser');
const OpenTok = require('opentok');
const ServerPersistence = require('./utilities/ServerPersistence');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/precall', function(req, res) {
  const { apiKey, apiSecret } = req.body;
  if (!apiKey || !apiSecret) {
    res.status(500).send();
  }

  const opentok = new OpenTok(apiKey, apiSecret);
  opentok.createSession({ mediaMode: 'routed' }, (error, testSession) => {
    res.json({
      precallSessionId: testSession.sessionId,
      precallToken: opentok.generateToken(
        testSession.sessionId, { role: 'publisher' })
    });
  });
});

const serverPersistence = new ServerPersistence([], 'redis://localhost:6379'); // !

// Get the information needed to connect to a session
// (creates it also if it isn't created already).
app.post('/room/:roomName/info', function(req, res) {
  console.log('info request received');
  const { 
    tbConfig, redisRoomPrefix, roomName, username, 
    mediaMode, newSession, sessionIdField
  } = req.body;
  console.log(req.body);

  // We have to check if we have a session id stored already on the persistence provider
  // (and if it's not too old). 
  // Note that we do not persist tokens. 
  const opentok = new OpenTok(tbConfig.apiKey, tbConfig.apiSecret);

  serverPersistence.getKey(`${redisRoomPrefix}${roomName}`)
    .then(sessionInfo => {
      if (newSession === 'yes' && sessionInfo) {
        console.log(`Deleting old information of session: ${JSON.stringify(sessionInfo)}`);
        serverPersistence.delKey(`${redisRoomPrefix}${roomName}`);
        sessionInfo = null;
      }
      return sessionInfo;
    })
    .then(getUsableSessionInfo.bind(opentok, mediaMode, tbConfig.maxSessionAgeMs, tbConfig.archiveAlways))
    .then(usableSessionInfo => {
      // Update the database. We could do this on getUsable...
      serverPersistence.setKeyExpiration(
        Math.round(tbConfig.maxSessionAgeMs / 1000), 
        `${redisRoomPrefix}${roomName}`, 
        JSON.stringify(usableSessionInfo)
      );

      // We have to create an authentication token for the new user...
      const fbUserToken = null; // TODO
      // and finally, answer...
      const answer = {
        apiKey: tbConfig.apiKey,
        token: opentok.generateToken(
          usableSessionInfo.sessionId, 
          { role: 'publisher', data: JSON.stringify({ username }) }
        ),
        username,
        // firebaseURL:
        // firebaseToken:
        // chromeExtId:
        enableArchiveManager: tbConfig.enableArchiveManager,
        enableAnnotation: tbConfig.enableAnnotations,
        enableArchiving: tbConfig.enableArchiving,
        enableSip: tbConfig.enableSip,
        requireGoogleAuth: tbConfig.sipRequireGoogleAuth,
        googleId: tbConfig.googleId,
        googleHostedDomain: tbConfig.googleHostedDomain,
        reportIssueLevel: tbConfig.reportIssueLevel
      };

      answer[sessionIdField || 'sessionId'] = usableSessionInfo.sessionId;
      if ('sessionIdField' in answer) console.log('sessionIdField here');
      else console.log('sessionId here');
      res.json({ answer });
    });
});

// Given a sessionInfo (which might be empty or non usable) returns a promise that will
// fullfill to a usable sessionInfo. This function cannot be invoked directly, it has to 
// be found so 'this' is a valid Opentok instance!
function getUsableSessionInfo(mediaMode, maxSessionAge, archiveAlways, sessionInfo) {
  sessionInfo = sessionInfo && JSON.parse(sessionInfo);
  return new Promise(resolve => {
    const minLastUsage = Date.now() - maxSessionAge;
    console.log(`getUsableSessionInfo. sessionInfo: ${JSON.stringify(sessionInfo)},
                minLastUsage: ${minLastUsage},
                maxSessionAge: ${maxSessionAge},
                archiveAlways: ${archiveAlways}`);

    if (!sessionInfo || sessionInfo.lastUsage <= minLastUsage) {
      console.log('Need to create a new session');
      // We need to create a new session
      const sessionOptions = { mediaMode };
      if (archiveAlways) {
        sessionOptions.archiveMode = 'always';
      }
      this.createSession(sessionOptions, (error, session) => {
        resolve({
          sessionId: session.sessionId,
          lastUsage: Date.now(),
          inProgressArchiveId: undefined,
          mediaMode
        });
      });
    } else {
      console.log('Need to update the last usage data');
      // We only need to update the last usage data...
      resolve({
        sessionId: sessionInfo.sessionId,
        lastUsage: Date.now(),
        inProgressArchiveId: sessionInfo.inProgressArchiveId
      });
    }
  });
}

const port = 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
