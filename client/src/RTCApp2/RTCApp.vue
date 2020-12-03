<template>
  <Room :config="appConfig" />
</template>

<script>
import Room from './pages/Room.vue';

export default {
  name: 'RTCApp',
  components: { Room },
  props: {
    config: { type: Object, default: () => ({}) },
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
