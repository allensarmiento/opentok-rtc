import * as PrecallController from './precallController';
import * as RoomView from '../views/roomView';
import OTHelper from '../helpers/OTHelper';
import * as Utils from '../utils/browserUtils';

const roomVariables = {
  showTos: false,

  otHelper: null,

  resolutionAlgorithm: null,
  debugPreferredResolution: null,
  enableHangoutScroll: false
};

export function init() {
  // Init PrecallController
  PrecallController.init(roomVariables.showTos);
  // Load OTHelper
  // Create OTHelper instance
  roomVariables.otHelper = new OTHelper();
  // Get Room Parameters
  getRoomParams();
  // Get Room Info
  // ...
}

function getRoomParams() {
  const pathName = getPathName();
  const roomURI = getRoomURI(pathName);
  const roomName = Utils.decodeStr(roomURI);

  // Recover user identifier
  const params = Utils.parseSearch(document.location.search);
  const usrId = params.getFirstValue('userName');

  roomVariables.resolutionAlgorithm = 
    params.getFirstValue('resolutionAlgorithm');
  roomVariables.debugPreferredResolution = 
    params.getFirstValue('debugPreferredResolution');
  roomVariables.enableHangoutScroll = 
    params.getFirstValue('enableHangoutScroll') !== undefined;

  PrecallController
    .showCallSettingsPrompt(roomName, usrId, otHelper).then(info => {
      info.roomURI = roomURI;

      RoomView.showRoom();
      // TODO RoomView.roomName = roomName;
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

