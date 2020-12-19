<template>
  <Room
    :config="appConfig"
    :opentokApiKey="opentokApiKey"
    :opentokApiSecret="opentokApiSecret"
  />
</template>

<script>
import Room from './pages/Room.vue';

export default {
  name: 'RTCApp',
  components: { Room },
  props: {
    config: { type: Object, default: () => ({}) },
    opentokApiKey: { type: String, default: '' },
    opentokApiSecret: { type: String, default: '' },
  },
  data() {
    return {
      appConfig: { ...this.config },
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
