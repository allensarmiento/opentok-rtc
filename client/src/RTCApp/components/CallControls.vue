<template>
  <div
    :class="['controls', visibleControls ? 'visible' : '']"
    @mouseover="mouseover"
    @mouseout="mouseout"
  >
    <ControlsButton color="red">
      <template v-slot:button>
        <DataIcon dataIcon="end-call" />
      </template>
      <template v-slot:description>Leave Call</template>
    </ControlsButton>
    <ControlsButton
      :active="publishVideo"
      @click.native="setPublishVideo(!publishVideo)"
    >
      <template v-slot:button>
        <DataIcon :dataIcon="publishVideo ? 'video' : 'no-video'" />
      </template>
      <template v-slot:description>Your Video</template>
    </ControlsButton>
    <ControlsButton
      :active="publishAudio"
      @click.native="setPublishAudio(!publishAudio)"
    >
      <template v-slot:button>
        <DataIcon :dataIcon="publishAudio ? 'mic' : 'mic-muted'" />
      </template>
      <template v-slot:description>Your Mic</template>
    </ControlsButton>
    <ControlsButton>
      <template v-slot:button>
        <DataIcon dataIcon="add" />
      </template>
      <template v-slot:description>Invite</template>
    </ControlsButton>
    <ControlsButton
      :active="isScreensharing"
      @click.native="setIsScreensharing(!isScreensharing)"
    >
      <template v-slot:button>
        <DataIcon dataIcon="screenshare" />
      </template>
      <template v-slot:description>Share Screen</template>
    </ControlsButton>
    <ControlsButton>
      <template v-slot:button>
        <DataIcon dataIcon="annotate" />
      </template>
      <template v-slot:description>Annotate</template>
    </ControlsButton>
    <ControlsButton @click.native="setShowChat(!showChat)">
      <template v-slot:button>
        <DataIcon dataIcon="message" />
      </template>
      <template v-slot:description>
        Message &nbsp;
        <span>
          (<span>{{ unreadMessages.length }})</span>
        </span>
      </template>
    </ControlsButton>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ControlsButton from './ControlsButton.vue';
import DataIcon from '../ui/DataIcon.vue';

export default {
  name: 'CallControls',
  components: { ControlsButton, DataIcon },
  watch: {
    showControls(shouldShow) {
      if (shouldShow) {
        this.show();
      }
    },
    showChat(shouldShow) {
      if (shouldShow) {
        setTimeout(() => {
          this.setVisibleChat(true);
        }, 50);
      }
    },
    visibleChat(isVisible) {
      if (!isVisible) {
        setTimeout(() => {
          this.setShowChat(false);
        }, 50);
      }
    },
  },
  computed: {
    ...mapState('rtcApp', [
      'config',
      'showControls',
      'visibleControls',
      'overControls',
      'hideControlsTimer',
      'publishVideo',
      'publishAudio',
      'isScreensharing',
      'showChat',
      'visibleChat',
      'unreadMessages',
    ]),
  },
  // TODO: Should clear the timeout on unmount
  methods: {
    ...mapActions('rtcApp', [
      'mouseoverControls',
      'setVisibleControls',
      'setOverControls',
      'setHideControlsTimer',
      'setPublishVideo',
      'setPublishAudio',
      'setIsScreensharing',
      'setShowChat',
      'setVisibleChat',
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
  background-image: url(../assets/call-controls-bg.svg);
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

::v-deep [data-icon="end-call"] {
  height: 2.1rem;
  width: 3.4rem;
  background-image: url(../assets/hang-up.svg);
}

::v-deep [data-icon="video"] {
  height: 1.54rem;
  width: 2.6rem;
  background-image: url(../assets/video-icon.svg);
}

::v-deep [data-icon="no-video"] {
  height: 3rem;
  width: 3rem;
  background-image: url(../assets/no-video.svg);
}

::v-deep [data-icon="mic"] {
  height: 3rem;
  width: 3.1rem;
  margin-top: .6rem;
  background-image: url(../assets/mic.svg);
}

::v-deep [data-icon="mic-muted"] {
  height: 3rem;
  width: 3.1rem;
  margin-left: .3rem;
  background-image: url(../assets/mic-muted.svg);
}

::v-deep [data-icon="add"] {
  height: 2.8rem;
  width: 2.7rem;
  background-image: url(../assets/add.svg);
}

::v-deep [data-icon="screenshare"] {
  height: 2.9rem;
  width: 3.7rem;
  background-image: url(../assets/screenshare.svg);
}

::v-deep [data-icon="annotate"] {
  height: 2.2rem;
  width: 2.2rem;
  background-image: url(../assets/annotate.svg);
}

::v-deep [data-icon="message"] {
  height: 2rem;
  width: 2.4rem;
  background-image: url(../assets/message.svg);
}
</style>
