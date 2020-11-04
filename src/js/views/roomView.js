import * as HtmlElems from '../components/htmlElems';
import * as Events from '../state/events';
import * as Modal from '../components/modal';

const DOM = {
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
  screenElem: document.getElementById('screen')
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
  chatVisibility: `${roomViewPreface}:chatVisibility`
}

let _chatHasBeenShown = false;
let _unreadMsg = 0;

const MODAL_TXTS = {
  mute: {
    head: 'Mute all participants, including yourself',
    detail: 'Everyone will be notified and can click their ' + 
      '<i data-icon="no_mic"></i> button to unmute themselves.',
    button: 'Mute all participants'
  }
  // TODO
};

export function init(hangoutScroll, archiveManager, sip) {
  enableArchiveManager = archiveManager;
  DOM.dock.style.visibility = 'visible';
  enableSip = sip;
  // TODO
}

function addHandlers() {
  DOM.handler.addEventListener('click', handlerClicked);

  DOM.callControlsElem.addEventListener('click', callControlsClicked);
  // TODO
}

function handlerClicked() {
  DOM.dock.classList.toggle('collapsed');
  DOM.dock.data('previouslyCollapsed', null);
}

// If a call control element is clicked, the id represents the button 
// element id and the event represents the function to execute.
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
    // TODO
    Modal.showConfirm();
  }
};

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

function setUnreadMessages(count) {
  _unreadMsg = count;
  DOM.unreadCountElem.textContent = count;
}

function callControlsClicked(evt) {
  let elem = evt.target;
  elem = HtmlElems.getAncestorByTagName(elem, 'button');
  if (elem === null) {
    return;
  }

  switch(elem.id) {

  }
}
