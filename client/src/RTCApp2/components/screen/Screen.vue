<template>
  <section class="screen">
    <div class="screen__streams">
      <div class="tc-list">
        <ul></ul>
      </div>
    </div>

    <div id="call-controls" class="call-controls">
      <ControlsButton
        id="endCall"
        dataIcon="end_call"
        buttonColor="red"
        disabled
      >
        Leave Call
      </ControlsButton>

      <ControlsButton id="toggle-publisher-video" dataIcon="no_video">
        Your Video
      </ControlsButton>

      <ControlsButton id="toggle-publisher-audio" dataIcon="mic-muted">
        Your Mic
      </ControlsButton>

      <ControlsButton id="addToCall" dataIcon="add">
        Invite
      </ControlsButton>

      <ControlsButton
        v-if="enableScreensharing"
        id="screen-share"
        dataIcon="screenshare"
      >
        Share Screen
      </ControlsButton>

      <ControlsButton v-if="enableAnnotation" id="annotate" dataIcon="annotate">
        Annotate
      </ControlsButton>

      <ControlsButton id="message-btn" dataIcon="message">
        Message&nbsp;
        <span id="unreadMsg">
          (<span id="unreadCount">0</span>)
        </span>
      </ControlsButton>
    </div>
  </section>
</template>

<script>
import ControlsButton from '../call-controls/ControlsButton.vue';

export default {
  name: 'Screen',
  components: { ControlsButton },
  props: {
    enableScreensharing: { type: Boolean, default: false },
    enableAnnotation: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";
@import "../../sass/variables.scss";

.screen {
  // visibility: hidden;
  flex: 1;
  position: relative;
  margin-top: 9.8rem;
  padding: 1.5rem 1.5rem 0 2rem;
  background-color: #5f6062;
  overflow: hidden;

  &__streams {
    @include for-size(smartphones-portrait) {
      height: 100%;
    }
  }

  @include for-size(smartphones-portrait) {
    height: calc("100% - 6.8rem");
    margin-top: 6.4rem;
    margin-bottom: .2rem;
    padding: .2rem;
  }
}

.call-controls {
  display: table;
  table-layout: fixed;
  position: absolute;
  bottom: -86px;
  left: calc(50% - 2.9rem);
  height: 8.6rem;
  width: 52rem;
  margin: auto;
  padding: 0 4rem;
  z-index: 1001;
  background-image: url(../../assets/images/call-controls-bg.svg);
  background-repeat: no-repeat;
  // opacity: 0;
  transition: all $transition-time;

  @include for-size(smartphones-portrait) {
    right: 0;
    left: 0;
    width: calc(100% + .2rem);
    padding: 0;
    background-color: rgba(0, 0, 0, 0.8);
    background-image: none;
  }
}
</style>
