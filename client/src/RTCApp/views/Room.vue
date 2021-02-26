<template>
  <div class="room">
    <TopBanner />
    <RoomScreen />
    <Chat />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TopBanner from '../components/TopBanner.vue';
import RoomScreen from '../components/RoomScreen.vue';
import Chat from '../components/Chat.vue';

export default {
  name: 'RoomPage',
  components: { TopBanner, RoomScreen, Chat },
  computed: {
    ...mapState('rtcApp', ['config']),
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
