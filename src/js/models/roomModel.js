import * as Request from '../helpers/request';
import * as Events from '../state/events';
import * as Modal from '../components/modal';
import * as RoomStatus from './roomStatus';

const roomViewPreface = 'roomView';
const roomControllerPreface = 'roomController';
const roomStatusPreface = 'roomStatus';

const eventHandlers = {
  roomView: {
    endCall: `${roomViewPreface}:endcall`,
    startArchiving: `${roomViewPreface}:startArchiving`,
    stopArchiving: `${roomViewPreface}:stopArchiving`,
    streamVisibilityChange: `${roomViewPreface}:streamVisibilityChange`,
    buttonClick: `${roomViewPreface}:buttonClick`,
    videoSwitch: `${roomViewPreface}:videoSwitch`,
    muteAllSwitch: `${roomViewPreface}:muteAllSwitch`,
    dialOut: `${roomViewPreface}:dialOut`,
    addToCall: `${roomViewPreface}:addToCall`,
    togglePublisherAudio: `${roomViewPreface}:togglePublisherAudio`,
    togglePublisherVideo: `${roomViewPreface}:togglePublisherVideo`
  },
  
  roomController: {
    control: (control) => `${roomControllerPreface}:${control}`,
    userChangeStatus: `${roomControllerPreface}:userChangeStatus`,
    roomMuted: `${roomControllerPreface}:roomMuted`
  },

  roomStatus: {
    updatedRemotely: `${roomStatusPreface}:updatedRemotely`
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
    this.googleAuth = null;

    this.userName = null;
    this.roomURI = null;

    this.subscriberStreams = {};

    ////////////////////
    // View Event Handlers

    // Fires events for toggling video and audio.
    this.publisherButtons = {
      video: {
        eventFiredName: eventHandlers.roomView.buttonClick,
        dataIcon: 'video',
        eventName: 'click',
        action: 'togglePublisherVideo',
        enabled: true
      },
      audio: {
        eventFiredName: eventHandlers.roomView.buttonClick,
        dataIcon: 'mic',
        eventName: 'click',
        action: 'togglePublisherAudio',
        enabled: true
      }
    };

    this.dialedNumberTokens = {};

    this._sharedStatus = { roomMuted: false };
    this._disabledAllVideos = false;

    ////////////////////
    // Room Status Event Handlers
    this.setPublisherReady = null;
    this.publisherReady = new Promise(resolve => {
      this.setPublisherReady = resolve;
    });

    this.STATUS_KEY = 'room';
  }

  ////////////////////
  // View Event Handlers
  /** */
  addViewEventHandlers() {
    Events.addEventHandler(eventHandlers.roomView.endCall, this.endCall);

    Events.addEventHandler(
      eventHandlers.roomView.startArchiving, this.startArchiving);

    Events.addEventHandler(
      eventHandlers.roomView.stopArchiving, this.stopArchiving);

    Events.addEventHandler(
      eventHandlers.roomView.streamVisibilityChange, 
      this.streamVisibilityChange
    );

    Event.addEventHandler(
      eventHandlers.roomView.buttonClick, this.buttonClick);

    Event.addEventHandler(
      eventHandlers.roomView.videoSwitch, this.videoSwitch);

    Event.addEventHandler(
      eventHandlers.roomView.muteAllSwitch, this.muteAllSwitch);

    Event.addEventHandler(eventHandlers.roomView.dialOut, this.dialOut);

    Event.addEventHandler(eventHandlers.roomView.addToCall. this.addToCall);

    Event.addEventHandler(
      eventHandlers.roomView.togglePublisherAudio, 
      this.togglePublisherAudio
    );

    Event.addEventHandler(
      eventHandlers.roomView.togglePublisherVideo, 
      this.togglePublisherVideo
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
            this.sendSignalMuteAll(false, true);
            this._sharedStatus.roomMuted = false;
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

  /**
   * @param {boolean} status 
   * @param {boolean} onlyChangeSwitch 
   */
  sendSignalMuteAll(status, onlyChangeSwitch) {
    this.otHelper.sendSignal('muteAll', { status, onlyChangeSwitch });
  }

  /** @param {HTMLEvent} evt */
  videoSwitch(evt) {
    this.changeSubscriberStatus('video', evt.detail.status);
  }

  /**
   * @param {string} name 
   * @param {string | boolean} status 
   */
  changeSubscriberStatus(name, status) {
    this._disabledAllVideos = status;

    Object.keys(this.subscriberStreams).forEach(streamId => {
      if (
        this.subscriberStreams[streamId] &&
        this.subscriberStreams[streamId].stream.videoType === 'camera'
      ) {
        this.pushSubscriberButton(streamId, name, status);
      }
    });
  }

  /**
   * @param {string} streamId 
   * @param {string} name 
   * @param {string | boolean} status 
   */
  pushSubscriberButton(streamId, name, status) {
    this.buttonClick({ 
      detail: { 
        streamId, 
        name, 
        disableAll: true, 
        status 
      }
    });
  }

  /** @param {HTMLEvent} evt */
  muteAllSwitch(evt) {
    const roomMuted = evt.detail.status;
    this._sharedStatus.roomMuted = roomMuted;
    this.setAudioStatus(roomMuted);
    this.sendSignalMuteAll(roomMuted, false);
  }

  /** @param {string | boolean} switchStatus */
  setAudioStatus(switchStatus) {
    if (this.otHelper.isPublisherReady) {
      this.buttonClick({
        detail: {
          streamId: 'publisher',
          name: 'audio',
          disableAll: true,
          status: switchStatus
        }
      });
    }
  }

  /** @param {HTMLEvent} evt */
  dialOut(evt) {
    if (evt.detail) {
      const phoneNumber = evt.detail.replace(/\D/g, '');

      if (
        this.requireGoogleAuth && 
        (this.googleAuth.isSignedIn.get() !== true)
      ) {
        this.googleAuth.signIn().then(() => {
          document.body.data('google-signed-in', 'true');
          this._dialOut(phoneNumber);
        });
      } else {
        this._dialOut(phoneNumber);
      }
    }
  }

  /** @param {string} phoneNumber */
  _dialOut(phoneNumber) {
    const alreadyInCall = Object.keys(this.subscriberStreams)
      .some(streamId => {
        if (this.subscriberStreams[streamId]) {
          const stream = this.subscriberStreams[streamId].stream;
          return stream.isSip && stream.name === phoneNumber;
        }
        return false;
      });

    if (alreadyInCall) {
      console.log(`The number is already in this call: ${phoneNumber}`); // eslint-disable-line no-console
    } else {
      let googleIdToken;

      if (this.requireGoogleAuth) {
        const user = this.googleAuth.currentUser().get();
        googleIdToken = user.getAuthResponse().id_token;
      } else {
        googleIdToken = '';
      }

      const data = { phoneNumber, googleIdToken };
      Request.dialOut(this.roomURI, data);
      this.dialedNumberTokens[phoneNumber] = googleIdToken;
    }
  }

  /** */
  addToCall() {
    this.showAddToCallModal();
  }

  /** @return {Promise<HTMLElement>} */
  showAddToCallModal() {
    const selector = '.add-to-call-modal';

    return Modal.show(selector).then(() => {
      return new Promise(resolve => {
        const enterButton = document.querySelector(`${selector} button`);

        if (enterButton) {
          enterButton.addEventListener('click', function onClicked(evt) {
            evt.preventDefault();
            enterButton.removeEventListener('click', onClicked);

            return Modal.hide(selector).then(() => {
              resolve(document.querySelector(`${selector} input`).value.trim());
            });
          });
        }
      });
    });
  }

  /** @param {HTMLEvent} evt */
  togglePublisherAudio(evt) {
    const newStatus = evt.detail.hasAudio;

    if (
      !this.otHelper.isPublisherReady() || 
      this.otHelper.publisherHas('audio') !== newStatus
    ) {
      this.otHelper.togglePublisherAudio(newStatus);
    }
  }

  togglePublisherVideo(evt) {
    const newStatus = evt.detail.hasAudio;

    if (
      !this.otHelper.isPublisherReady() || 
      this.otHelper.publisherHas('video') !== newStatus
    ) {
      this.otHelper.togglePublisherVideo(newStatus);
    }
  }

  ////////////////////
  // Room Status Event Handlers
  /** */
  addRoomStatusEventHandlers() {
    Events.addEventHandler(
      eventHandlers.roomStatus.updatedRemotely, this.updatedRemotely);
  }

  /** */
  updatedRemotely() {
    this.publisherReady.then(() => {
      this._sharedStatus = RoomStatus.get(this.STATUS_KEY);
      const roomMuted = this._sharedStatus.roomMuted
      this.setAudioStatus(roomMuted);

      if (roomMuted) {
        Events.sendEvent(eventHandlers.roomController.roomMuted, {
          isJoining: true
        });
      }
    });
  }
}
