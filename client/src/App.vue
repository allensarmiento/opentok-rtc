<template>
  <div id="app">
    <RTCApp :config="config" />
  </div>
</template>

<script>
import axios from 'axios';
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
  async mounted() {
    const response = await axios.post('localhost:5000/credentials');
    const { data } = response;

    this.config.OpenTok.apiKey = data.apiKey;
    this.config.OpenTok.apiSecret = data.apiSecret;
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
