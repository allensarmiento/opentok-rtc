<template>
  <div
    id="controls"
    :class="['controls', visibleClass]"
    @mouseover="mouseoverControls"
    @mouseout="mouseoutControls"
  >
    <LeaveCallControl />
    <VideoControl />
    <MicControl />
    <InviteControl />
    <ScreenshareControl v-if="config.Screensharing.enabled" />
    <AnnotateControl v-if="config.Screensharing.annotations.enabled" />

    <ControlsButton id="message-btn">
      <template v-slot:button>
        <DataIcon dataIcon="message" />
      </template>
      <template v-slot:description>
        Message&nbsp;
        <span id="unreadMsg">
          (<span id="unreadCount">0</span>)
        </span>
      </template>
    </ControlsButton>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ControlsButton from './components/ControlsButton.vue';
import DataIcon from '../ui/DataIcon.vue';
import LeaveCallControl from './components/LeaveCallControl.vue';
import VideoControl from './components/VideoControl.vue';
import MicControl from './components/MicControl.vue';
import InviteControl from './components/InviteControl.vue';
import ScreenshareControl from './components/ScreenshareControl.vue';
import AnnotateControl from './components/AnnotateControl.vue';

export default {
  name: 'CallControls',
  components: {
    ControlsButton,
    DataIcon,
    LeaveCallControl,
    VideoControl,
    MicControl,
    InviteControl,
    ScreenshareControl,
    AnnotateControl,
  },
  watch: {
    show(value) {
      if (value) this.showControls();
    },
  },
  computed: {
    ...mapState('rtcApp', ['config']),
    ...mapState('rtcApp/callControls', [
      'show',
      'visible',
      'over',
      'hideTimer',
    ]),
    visibleClass() {
      return this.visible ? 'visible' : '';
    },
  },
  methods: {
    ...mapActions('rtcApp/callControls', [
      'mouseover',
      'setVisible',
      'setOver',
      'setHideTimer',
    ]),
    showControls() {
      this.setVisible(true);

      if (!this.over && !this.hideTimer) {
        this.setHideTimer(setTimeout(this.hideControls, 3000));
      }
    },
    hideControls() {
      this.setHideTimer(null);
      this.setVisible(false);
      this.mouseover(false);
    },
    mouseoverControls() {
      clearTimeout(this.hideTimer);
      this.setOver(true);
    },
    mouseoutControls() {
      this.setOver(false);
      this.hideControls();
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

::v-deep [data-icon="message"] {
  height: 2rem;
  width: 2.4rem;
  background-image: url(./assets/message.svg);
}
</style>
