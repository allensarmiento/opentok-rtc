<template>
  <div class="room">
    <TopBanner />
  </div>
</template>

<script>
import TopBanner from '../components/layout/TopBanner.vue';

export default {
  name: 'RoomPage',
  components: { TopBanner },
  props: {
    config: { type: Object, required: true },
  },
};
</script>

<style lang="scss" scoped>
@import "@/sass/variables.scss";

.room {
  display: flex;
  position: relative;
  margin: 0;
  width: 100%;
  height: 100vh;
  background-color: $main-background-color;
  color: #fff;
  font-family: $base-font-family;
  font-weight: $base-font-weight;

  &.forbidden {
    display: none !important;
  }
}
</style>
