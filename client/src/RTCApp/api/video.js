import axios from 'axios';

/* eslint-disable import/prefer-default-export */
export const getSessionCredentials = (endpoint, key, secret, roomName) => (
  axios.post(endpoint, {
    apiKey: key,
    apiSecret: secret,
    roomName,
  }).then((response) => {
    const { sessionId, token } = response.data;

    return { sessionId, token };
  }).catch((error) => console.log(error))
);
/* eslint-enable import/prefer-default-export */
