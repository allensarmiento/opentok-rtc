<template>
  <div class="room">
    <TopBanner />
    <RoomScreen />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TopBanner from './components/layout/TopBanner.vue';
import RoomScreen from './components/layout/RoomScreen.vue';

export default {
  name: 'RoomPage',
  components: { TopBanner, RoomScreen },
  computed: {
    ...mapState('RTCApp', ['config']),
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/variables.scss";

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
