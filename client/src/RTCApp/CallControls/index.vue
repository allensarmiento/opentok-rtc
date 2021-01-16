<template>
  <div
    id="controls"
    :class="['controls', visibleClass]"
    @mouseover="mouseoverControls"
    @mouseout="mouseoutControls"
  >
    <ControlsButton id="endCall" color="red">
      <template v-slot:button>
        <DataIcon dataIcon="end_call" />
      </template>
      <template v-slot:description>Leave Call</template>
    </ControlsButton>

    <ControlsButton id="toggle-publisher-video">
      <template v-slot:button>
        <DataIcon dataIcon="no_video" />
      </template>
      <template v-slot:description>Your Video</template>
    </ControlsButton>

    <ControlsButton id="toggle-publisher-audio">
      <template v-slot:button>
        <DataIcon dataIcon="mic-muted" />
      </template>
      <template v-slot:description>Your Mic</template>
    </ControlsButton>

    <ControlsButton id="addToCall">
      <template v-slot:button>
        <DataIcon dataIcon="add" />
      </template>
      <template v-slot:description>Invite</template>
    </ControlsButton>

    <ControlsButton v-if="config.Screensharing.enabled" id="screen-share">
      <template v-slot:button>
        <DataIcon dataIcon="screenshare" />
      </template>
      <template v-slot:description>Share Screen</template>
    </ControlsButton>

    <ControlsButton
      v-if="config.Screensharing.annotations.enabled"
      id="annotate"
    >
      <template v-slot:button>
        <DataIcon dataIcon="annotate" />
      </template>
      <template v-slot:description>Annotate</template>
    </ControlsButton>

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

export default {
  name: 'CallControls',
  components: {
    ControlsButton,
    DataIcon,
  },
  data() {
    return {
      visible: false,
      overControls: false,
      hideControlsTimer: null,
    };
  },
  watch: {
    callControls: {
      deep: true,
      handler() {
        if (this.callControls.show) this.showControls();
      },
    },
  },
  computed: {
    ...mapState('RTCApp', ['config', 'callControls']),
    visibleClass() {
      return this.visible ? 'visible' : '';
    },
  },
  methods: {
    ...mapActions('RTCApp', ['mouseoverCallControls']),
    showControls() {
      this.visible = true;

      if (!this.overControls && !this.hideControlsTimer) {
        this.hideControlsTimer = setTimeout(this.hideControls, 3000);
      }
    },
    hideControls() {
      this.hideControlsTimer = null;
      this.visible = false;
      this.mouseoverCallControls(false);
    },
    mouseoverControls() {
      clearTimeout(this.hideControlsTimer);
      this.overControls = true;
    },
    mouseoutControls() {
      this.overControls = false;
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
  background-image: url(../assets/images/call-controls-bg.svg);
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

::v-deep [data-icon="end_call"] {
  height: 2.1rem;
  width: 3.4rem;
  background-image: url(../assets/images/icons/hang-up.svg);
}

::v-deep [data-icon="no_video"] {
  height: 3rem;
  width: 3rem;
  background-image: url(../assets/images/icons/no_video.svg);
}

::v-deep [data-icon="mic-muted"] {
  height: 3rem;
  width: 3.1rem;
  margin-left: .3rem;
  background-image: url(../assets/images/icons/mic-muted.svg);
}

::v-deep [data-icon="add"] {
  height: 2.8rem;
  width: 2.7rem;
  background-image: url(../assets/images/icons/add.svg);
}

::v-deep [data-icon="screenshare"] {
  height: 2.9rem;
  width: 3.7rem;
  background-image: url(../assets/images/icons/screenshare.svg);
}

::v-deep [data-icon="annotate"] {
  height: 2.2rem;
  width: 2.2rem;
  background-image: url(../assets/images/icons/annotate.svg);
}

::v-deep [data-icon="message"] {
  height: 2rem;
  width: 2.4rem;
  background-image: url(../assets/images/icons/message.svg);
}
</style>
