import axios from 'axios';

const SERVER = process.env.NODE_ENV === 'production'
  ? window.location.origin
  : 'http://localhost:5000';

/**
 * @param {object} roomParams
 * @return {Promise<object>} Room information
 */
export function getRoomInfo(roomParams) {
  const userName = roomParams.username
    ? `?userName=${roomParams.username}`
    : '';

  return axios.post(
    `${SERVER}/room/${roomParams.roomURI}/info${userName}`,
    roomParams,
  )
    .then((data) => data.data.answer)
    .then((roomInfo) => {
      if (!(roomInfo && roomInfo.sessionId)) {
        throw new Error('Room\'s data could not be recovered.');
      }
      return roomInfo;
    })
    .catch(() => null);
}

export function composeData() {}
