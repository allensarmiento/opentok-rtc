<template>
  <RoomPage :config="config" />
</template>

<script>
import RoomPage from '@/pages/RoomPage.vue';

export default {
  name: 'RTCApp',
  components: {
    RoomPage,
  },
  props: {
    config: { type: Object, required: true },
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
