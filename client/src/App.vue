<template>
  <div id="app">
    <RTCApp />
  </div>
</template>

<script>
import RTCApp from './RTCApp/App.vue';

export default {
  name: 'App',
  components: {
    RTCApp,
  },
};
</script>

<style lang="less">
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
  // margin-top: 60px;
}
</style>
