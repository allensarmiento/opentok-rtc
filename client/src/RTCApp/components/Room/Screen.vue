<template>
  <section id="screen" :style="screenVisible" @mousemove="showControls">
    <div
      ref="layoutManagerContainer"
      class="streams"
      @click="layoutManagerClicked"
      @dblclick="layoutManagerClicked"
    >
      <div class="tc-list">
        <ul ref="layoutRendererContainer"></ul>
      </div>
    </div>

    <div
      id="call-controls"
      :class="['call-controls', callControls.visible]"
      @mouseover="mouseoverCallControls"
      @mouseout="mouseoutCallControls"
    >
      <div>
        <button id="endCall" @click="endCallClicked" disabled>
          <i data-icon="end_call"></i>
        </button>
        <p>Leave Call</p>
      </div>

      <div>
        <button
          id="toggle-publisher-video"
          :class="['selected', callControls.video.activated ? 'activated' : '']"
          @click="togglePublisherVideo"
          disabled
        >
          <i
            :data-icon="callControls.video.activated
              ? 'video_icon'
              : 'no_video'"
            data-event-name="roomView:buttonClick"
            data-action="video"
            data-stream-id="publisher"
            data-stream-type="publisher"
          ></i>
        </button>
        <p>Your Video</p>
      </div>

      <div>
        <button
          id="toggle-publisher-audio"
          :class="callControls.audio.activated ? 'activated' : ''"
          @click="togglePublisherAudio"
          disabled
        >
          <i :data-icon="callControls.audio.activated ? 'mic' : 'mic-muted'" />
        </button>
        <p>Your Mic</p>
      </div>

      <div id="addToCall-container">
        <button id="addToCall">
          <i data-icon="add"></i>
        </button>
        <p>Invite</p>
      </div>

      <!-- enableScreensharing -->
      <!-- enableAnnotation -->

      <div>
        <button id="message-btn" disabled>
          <i data-icon="message"></i>
        </button>
        <p>
          Message
          <span id="unreadMsg">(<span id="unreadCount">0</span>)</span>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import OTHelper from '../../helpers/OTHelper';
import Grid from '../../helpers/GridLayout';
import Float from '../../helpers/FloatLayout';
import F2FHorizontal from '../../helpers/F2FHorizontal';
import F2FVertical from '../../helpers/F2FVertical';

export default {
  name: 'Screen',
  props: {
    visible: { type: String, default: '' },
    otHelper: { type: OTHelper },
  },
  data() {
    return {
      overCallControls: false,
      hideCallControlsTimer: null,
      overFeedbackButton: false,
      hideFeedbackButtonTimer: null,

      callControls: {
        visible: '',

        video: { activated: true },
        audio: { activated: true },
      },

      layouts: {
        grid: Grid,
        float: Float,
        f2f_horizontal: F2FHorizontal,
        f2f_vertical: F2FVertical,
      },

      items: {},
    };
  },
  computed: {
    screenVisible() {
      return this.visible === 'visible'
        ? 'visibility: visible;'
        : '';
    },
  },
  mounted() {

  },
  methods: {
    showControls() {
      this.showCallControls();
    },
    showCallControls() {
      this.callControls.visible = 'visible';

      if (!this.overCallControls && !this.hideCallControlsTimer) {
        this.hideCallControlsTimer = setTimeout(this.hideCallControls, 3000);
      }
    },
    hideCallControls() {
      this.hideCallControlsTimer = null;
      this.callControls.visible = '';
    },
    mouseoverCallControls() {
      clearTimeout(this.hideCallControlsTimer);
      this.overCallControls = true;
    },
    mouseoutCallControls() {
      this.overCallControls = false;
      this.hideCallControls();
    },

    showFeedbackButton() {},
    hideFeedbackButton() {},
    mouseoverFeedbackButton() {},
    mouseoutFeedbackButton() {},

    endCallClicked() {
      this.otHelper.disconnect();
    },
    togglePublisherAudio(event) {
      const newStatus = event.detail.hasAudio;
      const shouldToggle = !this.otHelper.isPublisherReady()
        || this.otHelper.publisherHas('audio') !== newStatus;

      if (shouldToggle) {
        this.otHelper.togglePublisherAudio(newStatus);
      }
    },
    togglePublisherVideo(event) {
      const newStatus = event.detail.hasAudio;
      const shouldToggle = !this.otHelper.isPublisherReady()
        || this.otHelper.publisherHas('video') !== newStatus;

      if (shouldToggle) {
        this.otHelper.togglePublisherVideo(newStatus);
      }
    },

    layoutManagerClicked() {},
  },
};
</script>
