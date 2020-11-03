import * as Modal from '../components/modal';
import * as Events from '../state/events';
import tokboxNexmoLogo from '../../assets/images/new-vonage-logo.png';
import videoIcon from '../../assets/images/icons/video-icon.svg';
import micIcon from '../../assets/images/icons/mic-icon.svg';
import connectivityIcon from '../../assets/images/icons/connectivity-icon.svg';

const DOM = {
  precallTest: document.getElementById('pre-call-test'),
  meter: document.getElementById('precall-test-meter'),
  meterLevel: document.getElementById('precall-test-meter-level'),
  testStatusLabel: document.querySelector('#test-status label'),
  connectivityCancel: document.querySelector('#connectivity-cancel'),
  precallTestResults: document.querySelector('#pre-call-test-results'),
  audioBitrate: document.querySelector('#audio-bitrate'),
  videoBitrate: document.querySelector('#video-bitrate'),
  precallVideoPacketLoss: document.querySelector('#precall-video-packet-loss'),
  precallHeading: document.querySelector('#pre-call-heading'),
  precallDescription: document.querySelector('#pre-call-description'),
  precallIcon: document.querySelector('#precall-icon'),
  precallAudioPacketLoss: document.querySelector('#precall-audio-packet-loss'),

  roomName: document.querySelector('.user-name-modal button .room-name'),
  nameHeading: document.getElementById('name-heading'),
  videoPreview: document.getElementById('video-preview'),
  videoPreviewName: document.getElementById('video-preview-name'),
  enter: document.getElementById('enter'),
  userNameInput: document.getElementById('user-name-input'),

  acceptElement: document.querySelector('.tc-modal.contract .accept'),

  selectDevices: document.getElementById('select-devices'),

  audioMeterLevel: document.getElementById('audio-meter-level')
};

////////////////////
// Initialization
export function renderPrecallTemplate() {
  document.body.insertAdjacentHTML('beforeend', precallTemplateView());
}

export function precallTemplateView() {
  return `
    <section class="tc-modal user-name-modal">
      <img id="logo" src=${tokboxNexmoLogo} alt="Vonage logo" />

      <p id="name-heading" class="room-name"></p>

      <div class="precall-right">
        <form class="tc-dialog">
          <div id="video-preview">
            <div id="video-preview-name"></div>
          </div>

          <div id="enter-name-prompt">
            <div>
              <input id="user-name-input" 
                class="block username" 
                autocomplete="off" 
                autofocus />
              <label>Your Name (Optional)</label>
            </div>
          </div>

          <div class="publish-settings">
            <div id="video-settings">
              <div>
                <img src=${videoIcon} />
                <span>Camera</span>
              </div>

              <div id="video-switch" class="sourcePick switch-button">
                <a id="preToggleFacingMode">Switch</a>
              </div>

              <a id="initialVideoSwitch" class="activated">
                <label>On</label>
                <i data-icon="videoSwitch"></i>
              </a>
            </div>

            <div id="audio-settings">
              <div>
                <img src=${micIcon} />
                <div id="audio-meter-container">
                  <span>Microphone</span>
                  <div id="audio-meter">
                    <div id="audio-meter-level"></div>
                  </div>
                </div>
              </div>

              <div id="audio-switch" class="sourcePick switch-button">
                <a id="prePickMic">Switch</a>
              </div>

              <a id="initialAudioSwitch" class="activated">
                <label>On</label>
                <i data-icon="audioSwitch"></i>
              </a>
            </div>
            <br />
          </div>

          <div id="pre-call-test">
            <div id="precall-test-labels">
              <img src=${connectivityIcon} />
              <span>Connectivity Test</span>
              <span id="test-status">
                <label></label>
                <button id="connectivity-cancel">
                  <i data-icon="connectivity-cancel"></i>
                </button>
              </span>
            </div>
          </div>

          <div id="precall-test-meter">
            <div id="precall-test-meter-level"></div>
          </div>

          <button id="enter" 
            class="btn btn-blue btn-padding" 
            type="submit" 
            disabled
          >
            <span class="room-name"></span>
          </button>
        </form>
      </div>

      <div id="pre-call-test-results">
        <i id="precall-close" data-icon="close-box"></i>
        <i id="precall-icon" data-icon="precall-tick"></i>
        <p id="pre-call-heading">Precall Test Results</p>
        <p id="pre-call-description">
          You can expect a great experience on your video call!
        </p>

        <div id="results">
          <div id="precall-video-results" class="precall-media-results">
            <p class="media-heading">VIDEO QUALITY</p>
            <p class="bitrate">
              <span id="video-bitrate"></span> Kbps
            </p>
            <p id="precall-resolution"></p>
            <p id="precall-framework"></p>
            <p id="precall-video-packet-loss"></p>
          </div>

          <div id="precall-audio-results" class="precall-media-results">
            <p class="media-heading">AUDIO QUALITY</p>
            <p class="bitrate">
              <span id="audio-bitrate">40</span> Kbps
            </p>
            <p id="precall-audio-packet-loss">0% packet loss</p>
          </div>
        </div>

        <div id="retest">
          <i id="precall-retest" data-icon="precall-retest"></i>
          Re-test
        </div>
      </div>
    </section>
  `;
};

export function renderTosTemplate() {
  document.body.insertAdjacentHTML('beforeend', tosTemplateView());
}

function tosTemplateView() {
  return `
    <section class="tc-modal contract">
      <form class="tc-dialog">
        <i data-icon="close_gray" class="close"></i>
        <header>
          <span>Terms of Use</span>
        </header>
        <p>By accepting our terms of use you acknowledge that you have read the <a target="_blank" href="https://tokbox.com/support/tos">user agreement</a> and <a target="_blank" href="https://tokbox.com/support/privacy-policy">privacy policy</a>, and you are at least 18 years of age.</p>
        <footer>
          <button id="enter" class="btn tb btn-primary btn-arrow btn-next btn-padding accept">Accept and Continue</button>
        </footer>
      </form>
    </section>
  `;
}

////////////////////
// 
export function initPrecallTestMeter() {
  DOM.testStatusLabel.innerText = 'Testing audio / video quality…';
  DOM.meterLevel.style.width = 0;
  DOM.meterLevel.style['animation-play-state'] = 'running';
}

export function setTestMeterLevel(value) {
  const width = value * DOM.meter.offsetWidth;
  DOM.meterLevel.style.width = `${width}px`;
}

export function displayNetworkTestResults(result) {
  let packetLossStr;

  DOM.testStatusLabel.innerText = 'Done.';
  DOM.meterLevel.style['animation-play-state'] = 'paused';
  setTestMeterLevel(1);
  DOM.connectivityCancel.style.display = 'none';
  DOM.precallTestResults.style.display = 'block';
  DOM.audioBitrate.innerText = Math.round(results.audio.bitsPerSecond / 1000);

  if (results.video) {
    DOM.videoBitrate.innerText = Math.round(results.video.bitsPerSecond / 1000);
    packetLossStr = isNaN(results.video.packetLossRatio) 
      ? '' : `${Math.round(100 * results.video.packetLossRatio)}% packet loss`;
    DOM.precallVideoPacketLoss.innerText = packetLossStr;
  } else {
    DOM.videoBitrate.innerText = 0;
    DOM.precallVideoPacketLoss.innerText = 'No video.';
  }

  DOM.precallHeading.classList = results.classification;

  switch(results.classification) {
    case 'precall-tick':
      DOM.precallHeading.innerText = 'Excellent Connectivity';
      break;
    case 'precall-warning':
      DOM.precallHeading.innerText = 'OK Connectivity';
      break;
    case 'precall-error':
      DOM.precallHeading.innerText = 'Poor Connectivity';
      break;
  }

  DOM.precallDescription.innerText = results.text;
  DOM.precallIcon.setAttribute('data-icon', results.classification);
  packetLossStr = isNaN(results.audio.packetLossRatio)
    ? '' : `${Math.round(100 * results.audio.packetLossRatio)}% packet loss`;
  DOM.precallAudioPacketLoss.innerText = packetLossStr;
}

export function hideConnectivityTest() {
  DOM.precallTest.style.display = 'none';
  DOM.meter.style.display = 'none';
}

////////////////////
// 
export function setRoomName(roomName) {
  DOM.roomName.textContent = `Join ${roomName}`;
  DOM.nameHeading.textContent = roomName;
}

export function setUsername(username) {
  DOM.videoPreviewName.textContent = username;
  setTimeout(() => { DOM.videoPreviewName.style.opacity = 0 }, 2000);
}

export function setFocus(username) {
  const focusElement = username ? DOM.enter : DOM.userNameInput;
  focusElement.focus();
}

export function showContract() {
  const selector = '.tc-modal.contract';

  const onClicked = evt => {
    DOM.acceptElement.removeEventListener('click', onClicked);
    evt.preventDefault();
    sessionStorage.setItem('tosAccepted', true);
    Modal.hide(selector);
    resolve();
  };

  return Modal.show(selector, null, true)
    .then(() => {
      return new Promise(resolve => {
        DOM.acceptElement.addEventListener('click', onClicked);
        Events.addEventHandler('modal:close', showModal);
      });
    });
}

function showModal() {
  Events.removeEventHandler('modal:close', showModal);
  Modal.show('.user-name-modal');
}

export function populateAudioDevicesDropdown(audioDevices, selectedDeviceId) {
  audioDevices.forEach(device => {
    const option = document.createElement('option');
    option.text = device.label;
    option.value = device.deviceId;

    if (option.value === selectedDeviceId) {
      option.selected = true;
    }

    DOM.selectDevices.appendChild(option);
  });
}

export function setVolumeMeterLevel(level) {
  DOM.audioMeterLevel.style.width = `${(level * 89)}px`;
}

export function hide() {
  DOM.videoPreview.style.visibility = 'hidden';
  Events.removeEventHandler('modal:close', showModal);
}
