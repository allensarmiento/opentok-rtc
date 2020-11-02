import axios from 'axios';
import * as PrecallView from '../views/precallView';
import * as Modal from '../components/modal';
import OTNetworkTest from '../helpers/OTNetworkTest';
import * as Events from '../state/events';
import * as BrowserUtils from '../utils/browserUtils';

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
const DOM = {
  enter: document.querySelector('.user-name-modal #enter'),
  userNameModal: document.querySelector('.user-name-modal'),
  tcDialog: document.querySelector('.user-name-modal .tc-dialog')
};

const publisherOptions = {
  publishAudio: true,
  publishVideo: true,
  name: '',
  width: '100%',
  height: '100%',
  insertMode: 'append',
  showControls: false,
};

let previewOptions;
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
  const videoPreviewEventHandlers = this.getVideoPreviewEventHandlers(otHelper);

  return Modal
    .show(selector, () => void loadModalText(roomName, username, otHelper))
    .then(() => void PrecallView.setFocus(username));
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
      PrecallView.hideConnectivityTest();
      otNetworkTest.stopTest();
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

/** */
function displayNetworkTestResults(result) {
  let packetLossStr;
  clearInterval(testMeterInterval);
  PrecallView.displayNetworkTestResults(result);
}

/** */
function loadModalText(roomName, username, otHelper) {
  PrecallView.setRoomName(roomName);
  PrecallView.setUsername(username);
  PrecallView.setFocus(username);

  if (BrowserUtils.isIE() || BrowserUtils.isSafariIOS()) {
    PrecallView.hideConnectivityTest();
  }

  DOM.enter.disabled = false;
  DOM.userNameModal.addEventListener('keypress', event => {
    if (event.which === 13) {
      event.preventDefault();
      submitForm();
    }
  });

  DOM.tcDialog.addEventListener('submit', event => {
    event.preventDefault();
    submitForm();
  });

  otHelper.initPublisher('video-preview', publisherOptions)
    .then(pub => {
      publisher = pub;

      otHelper.getVideoDeviceNotInUse(publisherOptions.videoSource)
        .then(videoSourceId => {
          getCredentials().then(credentials => {
            previewOptions = {
              apiKey: credentials.apiKey,
              sessionId: credentials.sessionId,
              token: credentials.token
            };

            publisher.on('accessAllowed', () => {
              otHelper.getDevices('audioInput').then(audioDevs => {
                PrecallView.populateAudioDevicesDropdown(
                  audioDevs, publisherOptions, audioSource);

                // You cannot use the network test in IE or Safari because you
                // cannot use two publishers (the preview publisher and the 
                // network test publisher) simultaneously.
                if (!BrowserUtils.isIE() && !BrowserUtils.isSafariIOS()) {
                  startPrecallTestMeter();

                  otNetworkTest = new OTNetworkTest(previewOptions);
                  otNetworkTest.startNetworkTest((error, result) => {
                    displayNetworkTestResults(result);

                    if (result.audioOnly) {
                      publisher.publishVideo(false);
                      Events.sendEvent('PrecallController:audioOnly');
                    }
                  });
                }
              });
            });

            Events.addEventHandler('roomView:toggleFacingMode', () => {
              otHelper.toggleFacingMode().then(dev => {
                const deviceId = dev.deviceId;
                publisherOptions.videoSource = deviceId;
                window.localStorage.setItem('videoDeviceId', deviceId);
              });
            });

            Events.addEventHandler('roomView:setAudioSource', evt => {
              const deviceId = evt.detail;
              otHelper.setAudioSource(deviceId);
              publisherOptions.audioSource = deviceId;
              window.localStorage.setItem('audioDeviceId', deviceId);
            });

            Events.addEventHandler('roomView:initialAudioSwitch', evt => {
              const status = evt.detail.status;
              publisher.publishAudio(status);
              publisherOptions.publishAudio = status;
            });

            Events.addEventHandler('roomView:initialVideoSwitch', evt => {
              const status = evt.detail.status;
              publisher.publishVideo(status);
              publisherOptions.publishVideo = status;
            });

            Events.addEventHandler('roomView:retest', () => {
              startPrecallTestMeter();

              otNetworkTest.startNetworkTest((error, result) => {
                if (!error) {
                  displayNetworkTestResults();
                }
              });
            });

            Events.addEventHandler('roomView:cancelTest', () => {
              hideConnectivityTest();
              otNetworkTest.stopTest();
            });

            let movingAvg = null;
            publisher.on('audioLevelUpdated', event => {
              if (movingAvg === null || movingAvg <= event.audioLevel) {
                movingAvg = event.audioLevel;
              } else {
                movingAvg = (0.8 * movingAvg) + (0.2 * event.audioLevel);
              }

              // 1.5 scaling to map the -30 - 0 dBm range to [0,1]
              let logLevel = ( (Math.log(movingAvg) / Math.LN10) / 1.5 ) + 1;
              logLevel = Math.min(Math.max(logLevel, 0), 1);

              PrecallView.setVolumeMeterLevel(logLevel);
            });
          });
        });
    });
}

function submitForm(showTos, selector) {
  if (showTos) {
    PrecallView.showContract().then(() => void hidePrecall(selector));
  } else {
    hidePrecall(selector);
  }
}

function hidePrecall(selector) {
  PrecallView.hide();

  if (publisher) {
    publisher.destroy();
  }

  if (!BrowserUtils.isIE() && otNetworkTest) {
    otNetworkTest.stopTest();
  }

  Modal.hide(selector)
    .then(() => {
      const username = document.querySelector(`${selector} input`).value.trim();

      window.localStorage.setItem('username', username);
      publisherOptions.name = username;

      setTimeout(() => {
        resolve({ username, publisherOptions });
      }, 1);
    });
}

function getCredentials() {
  return new Promise((resolve, reject) => {
    axios.post('/precall').then(data => {
      if (!data) reject();

      resolve({
        apiKey: data.apiKey,
        sessionId: data.sessionId,
        token: data.token
      });
    });
  });
}

