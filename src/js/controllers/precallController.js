import * as PrecallView from '../views/precallView';
import * as Events from '../state/events';

////////////////////
// Initialization
let alreadyInitialized = false;

export function init(showTos) {
  if (alreadyInitialized) return;
  
  addEventHandlers();
  PrecallView.renderPrecallTemplate();
  if (showTos) {
    PrecallView.renderTosTemplate();
  }
  alreadyInitialized = true;
}

function addEventHandlers() {
  Events.addEventHandler('roomView:endprecall', function() {
    Events.sendEvent('PrecallController:endPrecall');
  });

  // NOTE: Is this needed? 
  Events.addEventHandler('PrecallController:endPrecall', function() {
    model.addEventListener('value', render);
    // ? Why call the render method here when there's an event listener already?
    render();
  });

  Events.addEventHandler('PrecallController:audioOnly', function() {
    setSwitchStatus(false, 'Video', 'roomView:initialVideoSwitch');
  });
}

function render() {

}

function setSwitchStatus(status, switchName, eventName) {
  const switchValues = { on: 'On', off: 'off' };
  const elementId = `initial${switchName}Switch`;
  const domElem = document.getElementById(elementId);
  const labelElem = domElem.querySelector('label');
  const oldStatus = domElem.classList.contains('activated');

  let newStatus;
  
  if (status === undefined) {
    newStatus = domElem.classList.toggle('activated');
    labelElem.innerText = switchValues.on;
  } else {
    newStatus = status;
    
    if (status) {
      newStatus = domElem.classList.add('activated');
      labelElem.innerText = switchValues.on;
    } else {
      domElem.classList.remove('activated');
      labelElem.innerText = switchValues.off;
    }
  }

  if (newStatus !== oldStatus) {
    Events.sendEvent(eventName, { status: newStatus });
  }
}

////////////////////
//  
const publisherOptions = {
  publishAudio: true,
  publishVideo: true,
  name: '',
  width: '100%',
  height: '100%',
  insertMode: 'append',
  showControls: false,
};

let publisher;

let testMeterInterval;

let otNetworkTest;

/**
 * @param {string} roomName
 * @param {string} username
 * @return {object} Video preview event handlers.
 */
export function showCallSettingsPrompt(roomName, username, otHelper) {
  const selector = '.user-name-modal'; 

}

/** 
  * @param {OTHelper} otHelper An instance of OTHelper.
  * @return {object} Video preview event handlers.
  */
function getVideoPreviewEventHandlers(otHelper) {
  return {
    toggleFacingMode: () => {
      otHelper.toggleFacingMode().then(dev => {
        const deviceId = dev.deviceId;
        publisherOptions.videoSource = deviceId;
        window.localStorage.setItem('videoDeviceId', deviceId);
      });
    },

    setAudioSource: evt => {
      const deviceId = evt.detail;
      otHelper.setAudioSource(deviceId);
      publisherOptions.audioSource = deviceId;
      window.localStorage.setItem('audioDeviceId', deviceId);
    },

    initialAudioSwitch: evt => {
      publisher.publishAudio(evt.detail.status);
      publisherOptions.publishAudio = evt.detail.status;
    },

    initialVideoSwitch: evt => {
      publisher.publishVideo(evt.detail.status);
      publisherOptions.publishVideo = evt.detail.status;
    },

    retest: () => {
      startPrecallTestMeter();
      otNetworkTest.startNetworkTest((error, result) => {
        if (!error) {
          displayNetworkTestResults(result);
        } 
      });
    },

    cancelTest: () => {
      // TODO
    }
  };
}


/** */
function startPrecallTestMeter() {
  const TEST_DURATION_MAX = 200; // 200 seconds

  setSwitchStatus(true, 'Video', 'roomView:initialVideoSwitch');
  PrecallView.initPrecallTestMeter();

  let preCallTestProgress = 0;
  testMeterInterval = setInterval(function() {
    preCallTestProgress++; 
    PrecallView.setTestMeterLevel(preCallTestProgress / TEST_DURATION_MAX);
    if (preCallTestProgress === TEST_DURATION_MAX) {
      clearInterval(testMeterInterval);
    }
  }, 100);
}

function displayNetworkTestResults(result) {
  let packetLossStr;

  clearInterval(testMeterInterval);

  PrecallView.displayNetworkTestResults(result);
}

