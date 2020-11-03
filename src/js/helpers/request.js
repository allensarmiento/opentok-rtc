import axios from 'axios';

const server = window.location.origin;

/**
 * @param {object} roomParams
 * @return {Promise<object>} Room information
 */
export function getRoomInfo(roomParams) {
  const userName = roomParams.username ? `?userName=${roomParams.username}` : '';

  return axios.get(`${server}/room/${roomParams.roomURI}/info${username}`)
    .then(data => data.roomInfo)
    .then(roomInfo => {
      if (!(roomInfo && roomInfo.sessionId)) {
        throw new Error('Room\'s data coult not be recovered.');
      }
      return roomInfo;
    })
    .catch(error => null);
}

/** @param {object} data */
export function sendArchivingOperation(data) {
  // TODO: Need to revise how to call this properly.
  return axios.post(`${server}/room/${data.roomName}/archive`, {
    data: composeData(data)
  });
}

/** @param {object} data */
function composeData(data) {
  var composed = [];
  Object.keys(data).forEach(key => {
    composed.push(key);
    composed.push('=');
    composed.push(data[key]);
    composed.push('&');
  });
  composed.length && composed.pop();
  return composed.join('');
}

/**
 * @param {string} phoneNumber 
 * @param {string} token 
 */
export function hangUp(phoneNumber, token) {
  return axios.post(`${server}/hang-up/`, { 
    phoneNumber, googleIdToken: token });
}

/**
 * @param {string} roomURI 
 * @param {object} data 
 */
export function dialOut(roomURI, data) {
  return axios.post(`${server}/room/${roomURI}/dial`, { data });
}
