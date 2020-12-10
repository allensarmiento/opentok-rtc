<template>
  <div id="app">
    <RTCApp :config="config" />
  </div>
</template>

<script>
import RTCApp from './RTCApp2/RTCApp.vue';

export default {
  name: 'App',
  components: {
    RTCApp,
  },
  data() {
    return {
      config: {
        showTos: false,
        OpenTok: {
          apiKey: '',
          apiSecret: '',
        },
        Archiving: {
          enabled: false,
          archiveManager: {
            enabled: false,
          },
        },
        Feedback: {
          url: '',
          reportIssueLevel: 0,
        },
        Screensharing: {
          enabled: true,
          chromeExtensionId: null,
          annotations: {
            enabled: true,
          },
        },
      },
    };
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
