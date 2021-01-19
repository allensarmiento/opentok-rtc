<template>
  <Room v-if="mounted" />
</template>

<script>
import { mapActions } from 'vuex';
import Room from './Room/index.vue';

export default {
  name: 'RTCApp',
  components: {
    Room,
  },
  props: {
    config: { type: Object, required: true },
  },
  data() {
    return {
      mounted: false,
    };
  },
  mounted() {
    this.setConfig(this.config);
    this.mounted = true;
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
