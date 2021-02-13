<template>
  <ControlsButton
    id="toggle-publisher-video"
    :active="publishVideo"
    @click.native="setPublishVideo(!publishVideo)"
  >
    <template v-slot:button>
      <DataIcon :dataIcon="publishVideo ? 'video' : 'no-video'" />
    </template>
    <template v-slot:description>Your Video</template>
  </ControlsButton>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ControlsButton from './ControlsButton.vue';
import DataIcon from '../../ui/DataIcon.vue';

export default {
  name: 'VideoControl',
  components: { ControlsButton, DataIcon },
  computed: {
    ...mapState('rtcApp', ['publishVideo']),
  },
  methods: {
    ...mapActions('rtcApp', ['setPublishVideo']),
  },
};
</script>

<style lang="scss" scoped>
::v-deep [data-icon="video"] {
  height: 1.54rem;
  width: 2.6rem;
  background-image: url(../assets/video-icon.svg);
}

::v-deep [data-icon="no-video"] {
  height: 3rem;
  width: 3rem;
  background-image: url(../assets/no_video.svg);
}
</style>
