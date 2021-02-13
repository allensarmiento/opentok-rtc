<template>
  <section class="screen" @mousemove="mouseoverControls(true)">
    <div class="streams">
      <div class="tc-list">
        <VideoSession />
      </div>
    </div>

    <CallControls />
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import VideoSession from '../../VideoSession/index.vue';
import CallControls from '../../CallControls/index.vue';

export default {
  name: 'RoomScreen',
  components: {
    VideoSession,
    CallControls,
  },
  computed: {
    ...mapState('rtcApp', ['config']),
  },
  methods: {
    ...mapActions('rtcApp', ['mouseoverControls']),
  },
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";

.screen {
  flex: 1;
  position: relative;
  height: calc("100% - 11.2rem");
  margin-top: 9.8rem;
  padding: 1.5rem 1.5rem 0 2rem;
  background-color: #5f6062;
  overflow: hidden;

  @include for-size(smartphones-portrait) {
    height: calc("100% - 6.8rem");
    margin-top: 6.4rem;
    margin-bottom: .2rem;
    padding: .2rem;
  }
}

.streams {
  @include for-size(smartphones-portrait) {
    height: 100%;
  }
}
</style>
