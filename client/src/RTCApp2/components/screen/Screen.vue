<template>
  <section class="screen" @mousemove="mousemove" @mouseout="mouseout">
    <div class="screen__streams">
      <div class="tc-list">
        <ul></ul>
      </div>
    </div>

    <CallControls :show="showControls" />
  </section>
</template>

<script>
import CallControls from '../call-controls/CallControls.vue';

export default {
  name: 'Screen',
  components: { CallControls },
  props: {},
  data() {
    return {
      showControls: false,
      hideControlsTimer: null,
    };
  },
  methods: {
    mousemove() {
      this.showControls = true;
      // this.hideControlsTimer = setTimeout(this.hideControls, 3000);
    },
    mouseout() {
      this.showControls = false;
    },
    hideControls() {
      this.hideControlsTimer = null;
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
