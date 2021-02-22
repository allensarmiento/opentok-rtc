<template>
  <Landing v-if="!roomName" />
  <Room v-else />
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Landing from './views/Landing.vue';
import Room from './views/Room.vue';

export default {
  name: 'RTCApp',
  components: { Landing, Room },
  props: {
    config: { type: Object, required: true },
  },
  computed: {
    ...mapState('rtcApp', ['roomName', 'username']),
  },
  mounted() {
    this.setConfig(this.config);
  },
  methods: {
    ...mapActions('rtcApp', ['setConfig']),
  },
};
</script>

<style lang="scss">
// TODO: Convert px ratios to 16px later.
html {
  font-size: 62.5%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

body {
  box-sizing: border-box;
}
</style>
