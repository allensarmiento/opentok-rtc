<template>
  <Modal
    :show="showModal"
    class="tc-modal user-name-modal"
    @keyup.enter.prevent.native="submitForm"
  >
    <img
      id="logo"
      src="../../assets/images/new-vonage-logo.png"
      alt="Vonage logo"
    />

    <p id="name-heading" class="room-name">Join {{ roomName }}</p>

    <div class="precall-right">
      <form class="tc-dialog">
        <div id="video-preview">
          <div id="video-preview-name"></div>
        </div>

        <div id="enter-name-prompt">
          <div>
            <input
              ref="userNameInput"
              id="user-name-input"
              class="block username"
              autocomplete="off"
              autofocus
            />
            <label>Your Name (Optional)</label>
          </div>
        </div>

        <PublishSettings />
        <PrecallTest v-if="showConnectivityTest" />
        <PrecallTestMeter v-if="showConnectivityTest" />

        <button
          ref="enterButton"
          id="enter"
          class="btn btn-blue btn-padding"
          type="submit"
          :disabled="roomName ? true : false"
        >
          <span class="room-name">{{ roomName }}</span>
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

      <Results />

      <div id="retest">
        <i id="precall-retest" data-icon="precall-retest"></i>
        Re-test
      </div>
    </div>
  </Modal>
</template>

<script>
/*
 * The Precall view will run the network test. When done, it will
 * emit that the user is ready to go to the room.
 *
 * The modal adds the visible and show classes. It blurs any focused
 * elements and when a transition event is called, the modal will
 * close. The user-name-modal can probably be within a modal component.
 */
import Modal from '../Modal.vue';
import PublishSettings from './PublishSettings.vue';
import PrecallTest from './Test.vue';
import PrecallTestMeter from './TestMeter.vue';
import Results from './Results.vue';

import OTHelper from '../../helpers/OTHelper';
import * as BrowserUtils from '../../utilities/BrowserUtils';

export default {
  name: 'Precall',
  components: {
    Modal,
    PublishSettings,
    PrecallTest,
    PrecallTestMeter,
    Results,
  },
  props: {
    otHelper: { type: [OTHelper, null] },
    roomName: { type: String, default: '' },
    username: { type: String, default: '' },
  },
  data() {
    return {
      showModal: false,
      showConnectivityTest: true,
    };
  },
  methods: {
    showCallSettingsPrompt() {
      this.showModal = true;
    },
    loadModalText() {
      if (this.username) this.$refs.enterButton.focus();
      else this.$refs.userNameInput.focus();

      if (BrowserUtils.isIE() || BrowserUtils.isSafariIOS()) {
        this.hideConnectivityTest();
      }
    },
    hideConnectivityTest() {
      this.showConnectivityTest = false;
    },
    submitForm() {},
    hidePrecall() {},
  },
};
</script>
