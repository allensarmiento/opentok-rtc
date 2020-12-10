<template>
  <div
    id="call-controls"
    :class="['call-controls', visible ? 'visible' : '']"
    @mouseover="mouseoverCallControls"
    @mouseout="mouseoutCallControls"
  >
    <ControlsButton id="endCall" dataIcon="end_call" buttonColor="red">
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
</template>

<script>
import ControlsButton from './ControlsButton.vue';

export default {
  name: 'CallControls',
  components: { ControlsButton },
  props: {
    show: { type: Boolean, default: false },
    enableScreensharing: { type: Boolean, default: false },
    enableAnnotation: { type: Boolean, default: false },
  },
  data() {
    return {
      visible: false,
      overCallControls: false,
      hideCallControlsTimer: null,
    };
  },
  watch: {
    show(shouldShow) {
      if (shouldShow) this.showControls();
    },
  },
  methods: {
    showControls() {
      this.showCallControls();
    },
    showCallControls() {
      this.visible = true;

      if (!this.overCallControls && !this.hideCallControlsTimer) {
        this.hideCallControlsTimer = setTimeout(
          this.hideCallControls,
          3000,
        );
      }
    },
    hideCallControls() {
      this.hideCallControlsTimer = null;
      this.visible = false;
      this.$emit('hide');
    },
    mouseoverCallControls() {
      clearTimeout(this.hideCallControlsTimer);
      this.overCallControls = true;
    },
    mouseoutCallControls() {
      this.overCallControls = false;
      this.hideCallControls();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";
@import "../../sass/variables.scss";

.call-controls {
  display: table;
  table-layout: fixed;
  position: absolute;
  bottom: -8.6rem;
  left: calc(50% - 2.9rem);
  height: 8.6rem;
  width: 52rem;
  margin: auto;
  padding: 0 4rem;
  z-index: 1001;
  background-image: url(../../assets/images/call-controls-bg.svg);
  background-repeat: no-repeat;
  opacity: 0;
  transition: all $transition-time;

  &.visible {
    opacity: 1;
    bottom: 0;

    @include for-size(smartphones-portrait) {
      bottom: 1.4rem;
    }
  }

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
