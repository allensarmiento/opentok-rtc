<template>
  <div class="room" style="height: 98vh">
    <TopBanner />
  </div>
</template>

<script>
import TopBanner from '../components/top-banner/TopBanner.vue';

export default {
  name: 'Room',
  props: {
    config: { type: Object, default: () => ({}) },
  },
  components: {
    TopBanner,
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
  background-color: $mainBackgroundColor;
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>
