import * as Request from '../helpers/request';
import * as Events from '../state/events';

const roomViewPreface = 'roomView';
const roomControllerPreface = 'roomController';

const eventHandlers = {
  roomView: {
    endCall: `${roomViewPreface}:endcall`,
    startArchiving: `${roomViewPreface}:startArchiving`,
    stopArchiving: `${roomViewPreface}:stopArchiving`,
    streamVisibilityChange: `${roomViewPreface}:streamVisibilityChange`,

    buttonClick: `${roomViewPreface}:buttonClick`
  },
  
  roomController: {
    control: (control) => `${roomControllerPreface}:${control}`,
    userChangeStatus: `${roomControllerPreface}:userChangeStatus`
  }
};

export default class Room {
  constructor() {
    this.showTos = false;
    
    this.otHelper = null;
    this.resolutionAlgorithm = null;
    this.debugPreferredResolution = null;

    this.enableHangoutScroll = false;
    this.enableAnnotations = true;
    this.enableArchiveManager = false;
    this.enableSip = false;
    this.requireGoogleAuth = false; // For SIP dial-out

    this.userName = null;
    this.roomURI = null;

    this.subscriberStreams = {};

    // Fires events for toggling video and audio.
    this.publisherButtons = {
      video: {
        eventFiredName: eventHandlers.roomView.buttonClick,
        dataIcon: 'video',
        eventName: 'click',
        context: 'otHelper', // ! Not needed
        action: 'togglePublisherVideo',
        enabled: true
      },
      audio: {
        eventFiredName: eventHandlers.roomView.buttonClick,
        dataIcon: 'mic',
        eventName: 'click',
        context: 'otHelper', // ! Not needed
        action: 'togglePublisherAudio',
        enabled: true
      }
    };

    this.dialedNumberTokens = {};
  }

  /** */
  addEventHandlers() {
    Events.addEventHandler(eventHandlers.roomView.endCall, this.endCall);
    Events.addEventHandler(
      eventHandlers.roomView.startArchiving, this.startArchiving);
    Events.addEventHandler(
      eventHandlers.roomView.stopArchiving, this.stopArchiving);
    Events.addEventHandler(
      eventHandlers.roomView.streamVisibilityChange, 
      this.streamVisibilityChange
    );
  }

  /** */
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

  /** @param {HTMLEvent} evt */
  streamVisibilityChange(evt) {
    const streamId = evt.detail.id;
    if (streamId !== 'publisher') {
      const stream = this.subscriberStreams[streamId];
      if (stream) {
        this.otHelper.toggleSubscribersVideo(
          stream.stream, this._getStatus(stream.buttons.video));
      }
    }
  }

  /**
   * @param {HTMLEvent} evt 
   * @param {object} info 
   */
  _getStatus(evt, info) {
    let status = null;

    if (evt.detail.value === 'hidden') {
      info.prevEnabled = 'prevEnabled' in info 
        ? info.prevEnabled : info.enabled;
      status = false;
    } else {
      status = 'prevEnabled' in info ? info.prevEnabled : info.enabled;
      delete info.prevEnabled;
    }

    return status;
  }

  /** @param {HTMLEvent} evt */
  buttonClick(evt) {
    const { streamId, streamType, name } = evt.detail;
    const disableAll = !!evt.detail.disableAll;
    const switchStatus = evt.detail.status;

    let buttonInfo = null;
    let args = [];
    let newStatus;

    if (this._streamIdIsPublisher(streamId)) {
      buttonInfo = this.publisherButtons[name];
      newStatus = !buttonInfo.enabled;

      // There are a couple of possible race conditions that would end on
      // us not changing the status of the publisher (because it's already
      // on that state).
      if (
        !this.otHelper.isPublisherReady || 
        this.otHelper.publisherHas(name) === newStatus
      ) {
        return;   
      }
    } else {
      if (this._subscriberStream(streamId)) {
        console.log('Got an event from a nonexistent stream');
        return;
      }

      if (name === 'hangup') {
        this.hangup(streamId);
        return;
      }

      buttonInfo = stream.buttons[name];
      args.push(stream.stream);
      newStatus = !buttonInfo.enabled;

      // BUG xxxx - We don't receive videoDisabled/videoEnabled events when
      // stopping/starting the screen sharing video.
      // OPENTOK-26021 - We don't receive any event when mute/unmute the
      // audio in local streams.
      if (streamType === 'screen' || name === 'audio') {
        // so we assume the operation was performed properly and change the
        // UI status.
        this.sendStatus({ stream: stream.stream }, name, newStatus);
      }
    }

    if (!buttonInfo) {
      console.log('Got an event from an unkown button!');
      return;
    }

    args.push(newStatus);

    if (!disableAll || (disableAll && (switchStatus !== newStatus))) {
      const obj = this.otHelper;
      obj[buttonInfo.action].apply(obj, args);
      
      // If stream button clicked and isn't a screen
      if (!disableAll && streamType !== 'screen') {
        // if type = 'audio'
        //   it only has to propagate the change when the button clicked
        //   is the microphone
        // if type = 'video'
        //   only when button clicked is not the publisher's one (is a 
        //   subscriber's video button)
        // if type = 'screen'
        //   don't do anything
        const isMicrophone = 
          name === 'audio' && this._streamIdIsPublisher(streamId);
        const isSubscribeToVideo = 
          name === 'video' && !this._streamIdIsPublisher(streamId);
        
        if (isMicrophone || isSubscribeToVideo) {
          Events.sendEvent(
            eventHandlers.roomController.userChangeStatus, 
            { status: newStatus, name }
          );

          if (isMicrophone) {
            // TODO
          }
        }
      }
    }
  }

  /** @param {string} streamId */
  _streamIdIsPublisher(streamId) {
    return streamId === 'publisher';
  }

  /** @param {string} streamId */
  _subscriberStream(streamId) {
    return this.subscriberStreams[streamId];
  }

  /** @param {string} streamId */
  hangup(streamId) {
    if (!this.subscriberStreams[streamId]) {
      return;
    }

    const stream = this._subscriberStream(streamId).stream;
    if (!stream.isSip) {
      return;
    }

    const phoneNumber = stream.phoneNumber;
    if (!(phoneNumber in this.dialedNumberTokens)) {
      return;
    }

    const token = this.dialedNumberTokens[phoneNumber];
    Request.hangUp(phoneNumber, token);
    delete this.dialedNumberTokens[phoneNumber];
  }

  /**
   * @param {HTMLEvent} evt 
   * @param {string} control 
   * @param {string | boolean} enabled 
   */
  sendStatus(evt, control, enabled) {
    let stream = evt.stream || evt.target.stream;
    if (!stream) {
      return;
    } 

    const id = stream.streamId;
    stream = this.subscriberStreams[id];

    const buttonInfo = 
      !stream ? this.publisherButtons[control] : stream.buttons[control];
    buttonInfo.enabled = !!enabled;

    Events.sendEvent(
      eventHandlers.roomController.control(control), 
      { id, reason: evt.reason, enabled: buttonInfo.enabled }
    );
  }

  sendSignalMuteAll(status, onlyChangeSwitch) {
    // TODO
    // this.otHelper.sendSignal()
  }
}
