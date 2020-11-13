<template>
  <section class="tc-modal user-name-modal">
    <img
      id="logo"
      src="../../assets/images/new-vonage-logo.png"
      alt="Vonage logo"
    />

    <p id="name-heading" class="room-name"></p>

    <div class="precall-right">
      <form class="tc-dialog">
        <div id="video-preview">
          <div id="video-preview-name"></div>
        </div>

        <div id="enter-name-prompt">
          <div>
            <input
              id="user-name-input"
              class="block username"
              autocomplete="off"
              autofocus
            />
            <label>Your Name (Optional)</label>
          </div>
        </div>

        <PublishSettings />

        <div id="pre-call-test">
          <div id="precall-test-labels">
            <img src="../../assets/images/icons/connectivity-icon.svg" />
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

      <Results />

      <div id="retest">
        <i id="precall-retest" data-icon="precall-retest"></i>
        Re-test
      </div>
    </div>
  </section>
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
import PublishSettings from './PublishSettings.vue';
import Results from './Results.vue';

export default {
  name: 'Precall',
  components: {
    PublishSettings,
    Results,
  },
};
</script>
