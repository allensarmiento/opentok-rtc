<template>
  <RoomPage />
</template>

<script>
import RoomPage from './pages/RoomPage.vue';

export default {
  name: 'RTCApp',
  components: { RoomPage },
  mounted() {
    if (window.history.pushState) {
      console.log(`Host: ${window.location.hostname}`);
      console.log(`Pathname: ${window.location.pathname}`);
      console.log(`Search: ${window.location.search}`);

      const roomUrl = `${window.location.protocol}//`
        + `${window.location.host}`
        + `${window.location.pathname}`
        + `${window.location.search}`;
      window.history.pushState({ path: roomUrl }, '', roomUrl);
    }
  },
};
</script>

<style lang="less">
@import "./less/main.less";

// ! Might need to configure webpack for google fonts
// @import url("https://fonts.googleapis.com/css?family=Muli:300,300italic");
</style>
