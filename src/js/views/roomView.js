import * as HtmlElems from '../components/htmlElems';
import * as Events from '../state/events';
import * as Modal from '../components/modal';
import * as BubbleFactory from '../components/bubbleFactory';
import Cronograph from '../components/cronograph';

const DOM = {
  menu: document.getElementById('top-banner'),
  dock: document.getElementById('top-banner'),
  callControlsElem: document.querySelector('.call-controls'),
  feedbackButton: document.querySelector('.feedbackButton'),
  roomNameElem: document.querySelector('#top-banner .room-name'),
  participantsStrElem: document.getElementById('participantsStr'),
  recordingsNumberElem: document.querySelector('#top-banner #recordings'),
  videoSwitch: document.querySelector('#top-banner #videoSwitch'),
  audioSwitch: document.querySelector('#top-banner #audioSwitch'),
  unreadCountElem: document.getElementById('unreadCount'),
  togglePublisherAudioElem: document.getElementById('toggle-publisher-audio'),
  togglePublisherVideoElem: document.getElementById('toggle-publisher-video'),
  startArchivingElem: document.getElementById('startArchiving'),
  stopArchivingElem: document.getElementById('stopArchiving'),
  annotateBtnElem: document.getElementById('annotate'),
  manageRecordingsElem: document.getElementById('manageRecordings'),
  messageButtonElem: document.getElementById('message-btn'),
  topBannerElem: document.getElementById('top-banner'),
  screenElem: document.getElementById('screen'),

  selectDevices: document.getElementById('select-devices'),
  dialOutBtn: document.getElementById('dialOutBtn')
};
DOM.handler = DOM.dock;

let overCallControls = false;
let hideCallControlsTimer;

let overFeedbackButton = false;
let hideFeedbackButtonTimer;

// NOTE: These may not be used.
let roomName = '';
let roomURI = '';

////////////////////
// View
/** */
export function showRoom() {
  DOM.topBannerElem.style.visibility = 'visible';  

  DOM.screenElem.style.visibility = 'visible';
  DOM.screenElem.addEventListener('mousemove', showControls);

  DOM.callControlsElem.addEventListener('mouseover', () => {
    clearTimeout(hideCallControlsTimer);
    overCallControls = true;
  });
  DOM.callControlsElem.addEventListener('mouseout', () => {
    overCallControls = false;
    hideCallControls();
  });

  if (DOM.feedbackButton) {
    DOM.feedbackButton.addEventListener('mouseover', () => {
      clearTimeout(hideFeedbackButtonTimer);
      overFeedbackButton = true;
    });
    DOM.feedbackButton.addEventListener('mouseout', () => {
      overFeedbackButton = false;
      hideFeedbackButton();
    });
  }
}

/** */
function showControls() {
  showCallControls();
  showFeedbackButton();
}

/** */
function showCallControls() {
  DOM.callControlsElem.classList.add('visible');

  if (!overCallControls && !hideCallControlsTimer) {
    hideCallControlsTimer = setTimeout(hideCallControls, 3000);
  }
}

/** */
function hideCallControls() {
  hideCallControlsTimer = null;
  DOM.callControlsElem.classList.remove('visible');
}

/** */
function showFeedbackButton() {
  if (!DOM.feedbackButton) return;

  DOM.feedbackButton.classList.add('visible');

  if (!overFeedbackButton && !hideFeedbackButtonTimer) {
    hideFeedbackButtonTimer = setTimeout(hideFeedbackButton, 3000);
  }
}

/** */
function hideFeedbackButton() {
  hideFeedbackButtonTimer = null;
  feedbackButton.classList.remove('visible');
}

/** 
 * @param {string} room
 */
export function setRoomName(room) {
  HtmlElems.addText(DOM.roomNameElem, room);

  // NOTE: Shouldn't be needed.
  roomName = room;
}

/**
 * @param {string} uri
 */
export function setRoomURI(uri) {
  roomURI = uri;
}

////////////////////
// Initialization
let enableArchiveManager;
let enableSip;

const roomViewPreface = 'roomView';
const roomViewEvents = {
  addToCall: `${roomViewPreface}:addToCall`,
  togglePublisherVideo: `${roomViewPreface}:togglePublisherVideo`,
  togglePublisherAudio: `${roomViewPreface}:togglePublisherAudio`,
  screenShare: `${roomViewPreface}:shareScreen`,
  annotate: `${roomViewPreface}:screenChange`,
  chatVisibility: `${roomViewPreface}:chatVisibility`,
  endCall: `${roomViewPreface}:endCall`,
  toggleFacingMode: `${roomViewPreface}:toggleFacingMode`,
  setAudioSource: `${roomViewPreface}:setAudioSource`,
  startArchiving: `${roomViewPreface}:startArchiving`,
  stopArchiving: `${roomViewPreface}:stopArchiving`,
  endCall: `${roomViewPreface}:endCall`,
  shareScreen: `${roomViewPreface}:shareScreen`,
  videoSwitch: `${roomViewPreface}:videoSwitch`,
  muteAllSwitch: `${roomViewPreface}:muteAllSwitch`,
  verifyDialOut: `${roomViewPreface}:verifyDialOut`,
  dialOut: `${roomViewPreface}:dialOut`
};

let _chatHasBeenShown = false;
let _unreadMsg = 0;

const MODAL_TXTS = {
  mute: {
    head: 'Mute all participants, including yourself',
    detail: 'Everyone will be notified and can click their ' + 
      '<i data-icon="no_mic"></i> button to unmute themselves.',
    button: 'Mute all participants'
  },
  muteRemotely: {
    head: 'All participants microphones are being disabled in the call',
    detail: 'If you want to keep talking, you must manually enable your ' + 
      'own microphone.',
    button: 'I understand'
  },
  unmutedRemotely: {
    head: 'Your microphone is now enabled in the call',
    detail: 'If you want to remain muted, you must manually disable your ' + 
      'own microphone.',
    button: 'I understand'
  },
  join: {
    head: 'All participants are muted',
    detail: 'You can unmute everyone by toggling the Mute all participants ' +
      'option. Or you can unmute just yourself by clicking the microphone ' +
      'icon in the bottom menu.',
    button: 'I understand'
  },
  endCall: {
    head: 'Exit the Meeting',
    detail: 'You are going to exit the OpenTok Meeting Room. The call will ' + 
      'continue with the remaining participants.',
    button: 'End meeting'
  },
  sessionDisconnected: {
    head: 'Session disconnected',
    detail: 'The connection to the OpenTok platform has been lost. Check ' +    
      'your network connectivity and press Reload to connect again.',
    button: 'Reload'
  },
  chromePublisherError: {
    head: 'Internal Chrome Error',
    detail: 'Failed to acquire microphone. This is a known Chrome bug. ' + 
      'Please completely quit and restart your browser.',
    button: 'Reload'
  }
};

let particpantsNumber = 0;

/**
 * @param {*} hangoutScroll 
 * @param {*} archiveManager 
 * @param {*} sip 
 */
export function init(hangoutScroll, archiveManager, sip) {
  enableArchiveManager = archiveManager;
  DOM.dock.style.visibility = 'visible';
  enableSip = sip;
  // TODO
}

/** */
function addHandlers() {
  DOM.handler.addEventListener('click', handlerClicked);
  DOM.callControlsElem.addEventListener('click', callControlsClicked);
  DOM.menu.addEventListener('click', menuClicked);

  if (enableSip) {
    // Send event to get phonenumber from phoneNumberView
    DOM.dialOutBtn.addEventListener('click', dialOutBtnClicked)

    // Listen for PhoneNumberViewEvent
    Events.addEventHandler(phoneNumberViewEvents.dialOut, evt => {
      const phoneNumber = evt.detail;
      Events.sendEvent(roomViewEvents.dialOut, phoneNumber);
    });
  }

  window.addEventListener('archiving', evt => {
    switch(evt.detail.status) {
      case 'started':
        // TODO
    }
  });
}

function handlerClicked() {
  DOM.dock.classList.toggle('collapsed');
  DOM.dock.data('previouslyCollapsed', null);
}

////////////////////
// Call Controls
const callControlsEvents = {
  addToCall: function() {
    Events.sendEvent(roomViewEvents.addToCall);
  },

  togglePublisherVideo: function(elem) {
    let hasVideo;
    
    if (elem.classList.contains('activated')) {
      // Change the icon to no video
      elem.classList.remove('activated');
      elem.querySelector('i').data('icon', 'no_video');
      hasVideo = false;
    } else {
      // Change the icon to video
      elem.classList.add('activated');
      elem.querySelector('i').data('icon', 'video_icon');
      hasVideo = true;
    }

    Events.sendEvent(roomViewEvents.togglePublisherVideo, { hasVideo });
  },

  togglePublisherAudio: function(elem) {
    let hasAudio;

    if (elem.classList.contains('activated')) {
      // Change the icon to mic muted
      elem.classList.remove('activated');
      elem.querySelector('i').data('icon', 'mic-muted');
      hasAudio = false;
    } else {
      // Change the icon to mic
      elem.classList.contains('activated');
      elem.querySelector('i').data('icon', 'mic');
      hasAudio = true;
    }

    Events.sendEvent(roomViewEvents.togglePublisherAudio, { hasAudio });
  },

  screenShare: function() {
    Events.sendEvent(roomViewEvents.screenShare);
  },

  annotate: function() {
    if(document.body.data('annotationVisible') === 'true') {
      document.body.data('annotationVisible', 'false');
    } else {
      document.body.data('annotationVisible', 'true');
    }

    Events.sendEvent(roomViewEvents.annotate);
  },

  messageBtn: function() {
    setChatStatus(!DOM.messageButtonElem.classList.contains('activated'));
  },

  endCall: function() {
    Modal.showConfirm(MODAL_TXTS.endCall).then(endCall => {
      if (endCall) {
        particpantsNumber = 0;
        Events.sendEvent(roomViewEvents.endCall);
      }
    });
  }
};

/** @param {boolean} visible */
function setChatStatus(visible) {
  if (visible) {
    _chatHasBeenShown = true;
    setUnreadMessages(0);
    DOM.messageButtonElem.classList.add('activated');

    // hide call controls on small screens
    if (window.innerWidth <= 480) {
      hideCallControls();
    }
  } else {
    DOM.messageButtonElem.classList.remove('activated');
  }

  Events.sendEvent(roomViewEvents.chatVisibility, visible);
  HtmlElems.flush('#toggleChat'); // ! This function doesn't take any arguments
}

/** @param {number} count */
function setUnreadMessages(count) {
  _unreadMsg = count;
  DOM.unreadCountElem.textContent = count;
}

/** @param {HTMLEvent} evt */
function callControlsClicked(evt) {
  let elem = evt.target;
  elem = HtmlElems.getAncestorByTagName(elem, 'button');
  if (elem === null) {
    return;
  }

  switch(elem.id) {
    case 'addToCall':
      callControlsEvents.addToCall();
      break;
    case 'toggle-publisher-video':
      callControlsEvents.togglePublisherVideo();
      break;
    case 'toggle-publisher-audio':
      callControlsEvents.togglePublisherAudio();
      break;
    case 'screen-share':
      callControlsEvents.screenShare();
      break;
    case 'annotate':
      callControlsEvents.annotate();
      break;
    case 'message-btn':
      callControlsEvents.messageBtn();
      break;
    case 'endCall':
      callControlsEvents.endCall();
      break;
  }
}

////////////////////
// Menu 
const phoneNumberViewPreface = 'phoneNumberView';
const phoneNumberViewEvents = {
  dialOut: `${phoneNumberViewPreface}:dialOut`
};

const menuEvents = {
  toggleFacingMode: function() {
    Events.sendEvent(roomViewEvents.toggleFacingMode);
  },

  pickMic: function() {
    DOM.selectDevices.style.display = 'inline-block';
    Modal.showConfirm({
      head: 'Set mic input',
      detail: 'Please identify the audio source in the following list:',
      button: 'Change'
    }).then(start => {
      if (start) {
        Events.sendEvent(
          roomViewEvents.setAudioSource, DOM.selectDevices.value);
      }
      DOM.selectDevices.style.display = 'none';
    });
  },

  viewRecordings: function() {
    BubbleFactory.get('viewRecordings').toggle();
  },

  chooseLayout: function() {
    BubbleFactory.get('chooseLayout').toggle();
  },

  startArchiving: function() {
    Events.sendEvent(roomViewEvents.startArchiving);
  },

  stopArchiving: function() {
    Events.sendEvent(roomViewEvents.stopArchiving);
  },

  startChat: function() {
    setChatStatus(true);
  },

  stopChat: function() {
    setChatStatus(false);
  },

  endCall: function() {
    Modal.showConfirm(MODAL_TXTS.endCall).then(endCall => {
      if (endCall) {
        setParticipantsNumber(0);
        Events.sendEvent(roomViewEvents.endCall);
      }
    });
  },

  startSharingDesktop: function() {
    Events.sendEvent(roomViewEvents.shareScreen);
  },

  stopSharingDesktop: function() {
    Events.sendEvent(roomViewEvents.shareScreen);
  },

  videoSwitch: function() {
    let switchStatus = false;
    let bubbleUp = true;

    if (!DOM.videoSwitch.classList.contains('activated')) {
      switchStatus = true;
    }

    setSwitchStatus(
      switchStatus, bubbleUp, DOM.videoSwitch, roomViewEvents.videoSwitch);
  },

  audioSwitch: function() {
    if (!DOM.audioSwitch.classList.contains('activated')) {
      Modal.showConfirm(MODAL_TXTS.mute).then(shouldDisable => {
        if (shouldDisable) {
          setSwitchStatus(
            true, true, DOM.audioSwitch, roomViewEvents.muteAllSwitch);
          DOM.togglePublisherAudioElem.classList.remove('activated');
        }
      });
    } else {
      setSwitchStatus(
        false, true, DOM.audioSwitch, roomViewEvents.muteAllSwitch);
      DOM.togglePublisherAudioElem.classList.add('activated');
    }
  }
};

/** @param {HTMLEvent} evt */
function menuClicked(evt) {
  const elem = e.target;
  elem.blur();
  // pointer-events are not working on IE so we can receive as target a child
  elem = HTMLElems.getAncestorByTagName(elem, 'a');

  if (!elem) {
    return;
  }

  switch(elem.id) {
    case 'toggleFacingMode':
      menuEvents.toggleFacingMode();
      break;
    case 'pickMic':
      menuEvents.pickMic();
      break;
    case 'viewRecordings':
      menuEvents.viewRecordings();
      break;
    case 'chooseLayout':
      menuEvents.chooseLayout();
      break;
    case 'startArchiving':
      menuEvents.startArchiving();
      break;
    case 'stopArchiving':
      menuEvents.stopArchiving();
      break;
    case 'startChat':
      menuEvents.startChat();
      break;
    case 'stopChat':
      menuEvents.stopChat();
      break;
    case 'endCall':
      menuEvents.endCall();
      break;
    case 'startSharingDesktop':
      menuEvents.startSharingDesktop();
      break;
    case 'stopSharingDesktop':
      menuEvents.stopSharingDesktop();
      break;
    case 'videoSwitch':
      menuEvents.videoSwitch();
      break;
    case 'audioSwitch':
      menuEvents.audioSwitch();
      break;
  }
}

/** @param {string} value */
function setParticipantsNumber(value) {
  HtmlElems.replaceText(DOM.participantsStrElem, value);
}

/**
 * @param {boolean} status 
 * @param {boolean} bubbleUp 
 * @param {HTMLElement} domElem 
 * @param {HTMLEvent} evtName 
 */
function setSwitchStatus(status, bubbleUp, domElem, evtName) {
  const oldStatus = domElem.classList.contains('activated');
  let newStatus;

  if (status === undefined) {
    newStatus = domElem.classList.toggle('activated');
  } else {
    newStatus = status;

    if (status) {
      domElem.classList.add('activated');
    } else {
      domElem.classList.remove('activated');
    }
  }

  if (bubbleUp && newStatus !== oldStatus) {
    Events.sendEvent(evtName, { status: newStatus });
  }
}

/** @param {HTMLEvent} evt */
function dialOutBtnClicked(evt) {
  evt.preventDefault();
  Events.sendEvent(roomViewEvents.verifyDialOut);
}

////////////////////
// Archiving
let cronograph = new Cronograph();

function onStartArchiving(data) {
  const start = archive => {
    const duration = 0;

    if (archive) {
      duration = Math.round((Date.now() - archive.createdAt) / 1000);
    }

    cronograph.start(duration);
    DOM.startArchivingElem.style.display = 'none';
    DOM.stopArchivingElem.style.display = 'block';
    DOM.manageRecordingsElem.classList.add('recording');
  };

  if (!enableArchiveManager) {

  }
  // TODO
}
