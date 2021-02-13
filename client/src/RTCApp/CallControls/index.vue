<template>
  <div
    id="controls"
    :class="['controls', visibleClass]"
    @mouseover="mouseover"
    @mouseout="mouseout"
  >
    <LeaveCallControl />
    <VideoControl />
    <MicControl />
    <InviteControl />
    <ScreenshareControl v-if="config.Screensharing.enabled" />
    <AnnotateControl v-if="config.Screensharing.annotations.enabled" />
    <ChatControl />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import LeaveCallControl from './components/LeaveCallControl.vue';
import VideoControl from './components/VideoControl.vue';
import MicControl from './components/MicControl.vue';
import InviteControl from './components/InviteControl.vue';
import ScreenshareControl from './components/ScreenshareControl.vue';
import AnnotateControl from './components/AnnotateControl.vue';
import ChatControl from './components/ChatControl.vue';

export default {
  name: 'CallControls',
  components: {
    LeaveCallControl,
    VideoControl,
    MicControl,
    InviteControl,
    ScreenshareControl,
    AnnotateControl,
    ChatControl,
  },
  watch: {
    showControls(value) {
      if (value) this.show();
    },
  },
  computed: {
    ...mapState('rtcApp', [
      'config',
      'showControls',
      'visibleControls',
      'overControls',
      'hideControlsTimer',
    ]),
    visibleClass() {
      return this.visibleControls ? 'visible' : '';
    },
  },
  methods: {
    ...mapActions('rtcApp', [
      'mouseoverControls',
      'setVisibleControls',
      'setOverControls',
      'setHideControlsTimer',
    ]),
    show() {
      this.setVisibleControls(true);

      if (!this.overControls && !this.hideControlsTimer) {
        this.setHideControlsTimer(setTimeout(this.hide, 3000));
      }
    },
    hide() {
      this.setHideControlsTimer(null);
      this.setVisibleControls(false);
      this.mouseoverControls(false);
    },
    mouseover() {
      clearTimeout(this.hideTimer);
      this.setOverControls(true);
    },
    mouseout() {
      this.setOverControls(false);
      this.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/variables.scss";
@import "../sass/mixins.scss";

.controls {
  display: table;
  // table-layout: fixed;
  table-layout: auto;
  position: absolute;
  bottom: -8.6rem;
  left: calc(50% - 2.9rem);
  height: 8.6rem;
  width: 52rem;
  margin: auto;
  padding: 0 4rem;
  z-index: 1001;
  background-image: url(./assets/call-controls-bg.svg);
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
    background-color: rgba(0, 0, 0, .8);
    background-image: none;
  }
}
</style>
