<template>
  <div class="room" style="height: 98vh">
    <TopBanner />
    <Screen />
  </div>
</template>

<script>
import TopBanner from '../components/top-banner/TopBanner.vue';
import Screen from '../components/screen/Screen.vue';

export default {
  name: 'Room',
  props: {
    config: { type: Object, default: () => ({}) },
  },
  components: {
    TopBanner,
    Screen,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
@import "../sass/variables.scss";
@import "../sass/base.scss";

.room {
  display: flex;
  position: relative;
  margin: 0;
  color: #fff;
  background-color: $main-background-color;
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>
