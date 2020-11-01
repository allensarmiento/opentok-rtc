import * as Request from '../helpers/request';

export class RoomModel {
  constructor(otHelper, userName, roomURI) {
    this.otHelper = otHelper;
    this.userName  = userName;
    this.roomURI = roomURI;
  }

  addEventHandlers() {

  }

  endCall() {
    this.otHelper.disconnect();
  }

  /** */
  startArchiving(evt) {
    const detailOperation = evt.detail && evt.detail.operation;
    const operation = detailOperation || 'startComposite';
    this._sendArchivingOperation(operation);
  }

  stopArchiving() {
    this._sendArchivingOperation('stop');
  }

  /** @param {string} operation */
  _sendArchivingOperation(operation) {
    Request.sendArchivingOperation({
      userName: this.userName,
      roomName: this.roomURI,
      operation
    });
  }

  streamVisibilityChange(evt) {
    const streamId = evt.detail.id;
    if (streamId !== 'publisher') {
      // TODO
    }
  }
}

