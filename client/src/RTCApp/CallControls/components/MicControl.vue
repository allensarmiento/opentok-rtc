<template>
  <ControlsButton
    id="toggle-publisher-audio"
    :active="publishAudio"
    @click.native="setPublishAudio(!publishAudio)"
  >
    <template v-slot:button>
      <DataIcon :dataIcon="publishVideo ? 'mic' : 'mic-muted'" />
    </template>
    <template v-slot:description>Your Mic</template>
  </ControlsButton>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ControlsButton from './ControlsButton.vue';
import DataIcon from '../../ui/DataIcon.vue';

export default {
  name: 'MicControl',
  components: { ControlsButton, DataIcon },
  computed: {
    ...mapState('rtcApp/videoSession', ['publishAudio']),
  },
  methods: {
    ...mapActions('rtcApp/videoSession', ['setPublishAudio']),
  },
};
</script>

<style lang="scss" scoped>
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
</style>
