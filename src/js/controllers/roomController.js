import * as PrecallController from './precallController';
import * as RoomView from '../views/roomView';
import OTHelper from '../helpers/OTHelper';
import * as Request from '../helpers/request';
import * as Events from '../state/events';
import * as Utils from '../utils/browserUtils';

const roomVariables = {
  showTos: false,

  otHelper: null,

  resolutionAlgorithm: null,
  debugPreferredResolution: null,
  enableHangoutScroll: false,

  enableAnnotations: true,
  enableArchiveManager: false,
  enableSip: false,
  requireGoogleAuth: false, // For SIP dial-out

  userName: null,
  roomURI: null,

  resolutionAlgorithm: null,
  debugPreferredResolution: null
};

export function init() {
  // Init PrecallController
  PrecallController.init(roomVariables.showTos);
  // Load OTHelper
  // Create OTHelper instance
  roomVariables.otHelper = new OTHelper();
  // Get Room Parameters
  getRoomParams()
    .then(info => getRoomInfo(info))
    .then(params => {
      // Load annotations for analytics
      return params;
    })
    .then(params => {
      Events.addEventHandler('roomView:endCall', () => 
        void roomVariables.otHelper.disconnect());
      Events.addEventHandler('roomView:startArchiving', evt => {
        const detailOperation = evt.detail && evt.detail.operation;
        const operation = detailOperation || 'startComposite';
        sendArchivingOperation(operation);
      });
      Events.addEventHandler('roomView:stopArchiving', () => {
        // TODO
      });
    });
  // ...
}

/**
 * @return {object} Information about the room
 */
function getRoomParams() {
  const pathName = getPathName();
  const roomURI = getRoomURI(pathName);
  const roomName = Utils.decodeStr(roomURI);

  // Recover user identifier
  const params = Utils.parseSearch(document.location.search);
  const usrId = params.getFirstValue('userName');

  // Room variables
  roomVariables.resolutionAlgorithm = 
    params.getFirstValue('resolutionAlgorithm');
  roomVariables.debugPreferredResolution = 
    params.getFirstValue('debugPreferredResolution');
  roomVariables.enableHangoutScroll = 
    params.getFirstValue('enableHangoutScroll') !== undefined;

  // Startup precall controller 
  return PrecallController
    .showCallSettingsPrompt(roomName, usrId, otHelper).then(info => {
      info.roomURI = roomURI;

      RoomView.showRoom();
      RoomView.setRoomName(roomName);
      RoomView.setRoomURI(roomURI);

      const { 
        publishAudio, publishVideo, audioSource, videoSource 
      } = info.publisherOptions;
      publisherOptions.publishAudio = publishAudio;
      publisherOptions.publishVideo = publishVideo;
      publisherOptions.audioSource = audioSource;
      publisherOptions.videoSource = videoSource;

      return info;
    });
}

/**
 * Returns the path name or throws an error.
 */
function getPathName() {
  // pathName should be /room/<roomURI>[?username=<userName>]
  const pathName = document.location.pathname.split('/');

  if (!pathName || pathName.length < 2) {
    throw new Error('Invalid path');
  }

  return pathName;
}

/**
 * Returns the roomURI found at /room/<roomURI>
 */
function getRoomURI(pathName) {
  let roomURI = '';

  const length = pathName.length;
  if (length > 0) {
    roomURI = pathName[length - 1]; 
  }

  return roomURI;
}

/**
 * @param {object} roomParams
 * @return {object} Room information
 */
function getRoomInfo(roomParams) {
  return Request.getRoomInfo(roomParams)
    .then(roomInfo => {
      const credentialsValid = roomInfo.token && 
        roomInfo.sessionId && 
        roomInfo.apiKey;
      const roomInvalid = !(roomInfo && credentialsValid && roomInfo.username);
      const archiveInvalid = roomInfo.enableArchiveManager &&
        (!roomInfo.firebaseToken || !roomInfo.firebaseURL);

      if (roomInvalid || archiveInvalid) {
        console.error(
          `Error getRoomParams [${roomInfo}] without correct response`);
        throw new Error('Error getting room parameters.');
      }

      roomInfo.roomURI = roomParams.roomURI;
      roomInfo.publishAudio = roomParams.publishAudio;
      roomInfo.publishVideo = roomParams.publishVideo;
      
      roomVariables.enableAnnotations = roomInfo.enableAnnotation;
      roomVariables.enableArchiveManager = roomInfo.enableArchiveManager;
      roomVariables.enableSip = roomInfo.enableSip;
      roomVariables.requireGoogleAuth = roomInfo.requireGoogleAuth;  

      return roomInfo;
    });
}

/** @param {string} operation */
function sendArchivingOperation(operation) {
  Request.sendArchivingOperation({
    userName: roomVariables.userName,
    roomName: roomVariables.roomURI,
    operation
  });
}

