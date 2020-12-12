<template>
  <section class="screen" @mousemove="mousemove">
    <div class="screen__streams">
      <div class="tc-list">
        <Video
          :apiKey="config.OpenTok.apiKey"
          :sessionId="sessionId"
          :token="token"
        />
      </div>
    </div>

    <CallControls
      :show="showControls"
      :enableScreensharing="enableScreensharing"
      :enableAnnotation="enableAnnotation"
      @hide="hideControls"
    />
  </section>
</template>

<script>
import axios from 'axios';
import Video from '../video/Video.vue';
import CallControls from '../call-controls/CallControls.vue';

export default {
  name: 'Screen',
  components: { Video, CallControls },
  props: {
    config: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      showControls: false,
      hideControlsTimer: null,

      sessionId: '',
      token: '',
    };
  },
  async mounted() {
    const response = await axios.post('localhost:5000/sessionInfo');
    const { data } = response;

    this.sessionId = data.sessionId;
    this.token = data.token;
  },
  computed: {
    enableScreensharing() {
      let enabled = false;

      if ('Screensharing' in this.config) {
        const { Screensharing } = this.config;
        if ('enabled' in Screensharing) {
          enabled = Screensharing.enabled;
        }
      }

      return enabled;
    },
    enableAnnotation() {
      let enabled = false;

      if ('Screensharing' in this.config) {
        const { Screensharing } = this.config;
        if ('annotations' in Screensharing) {
          const { annotations } = Screensharing;
          if ('enabled' in annotations) {
            enabled = annotations.enabled;
          }
        }
      }

      return enabled;
    },
  },
  methods: {
    mousemove() {
      this.showControls = true;
    },
    hideControls() {
      this.showControls = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";

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
</style>
