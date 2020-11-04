import * as HtmlElems from '../components/htmlElems';

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
  screenElem: document.getElementById('screen'),
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

function callControlsClicked(evt) {
  let elem = evt.target;
  elem = HtmlElems.getAncestorByTagName(elem, 'button');
  // TODO
}
