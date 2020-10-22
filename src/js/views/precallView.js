import * as Events from '../state/events';
import tokboxNexmoLogo from '../../assets/images/new-vonage-logo.png';
import videoIcon from '../../assets/images/icons/video-icon.svg';
import micIcon from '../../assets/images/icons/mic-icon.svg';
import connectivityIcon from '../../assets/images/icons/connectivity-icon.svg';

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
            </div>

            <div id="audio-switch" class="sourcePick switch-button">
              <a id="prePickMic">Switch</a>
            </div>

            <a id="initialAudioSwitch" class="activated">
              <label>On</label>
              <i data-icon="audioSwitch"></i>
            </a>

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

