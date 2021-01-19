<template>
  <div id="app">
    <RTCApp v-if="validOpenTokCredentials" :config="config" />
  </div>
</template>

<script>
import axios from 'axios';
import RTCApp from './RTCApp/index.vue';

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
          enabled: true,
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
  computed: {
    validOpenTokCredentials() {
      const { apiKey, apiSecret } = this.config.OpenTok;
      return apiKey && apiSecret;
    },
  },
  async mounted() {
    const response = await axios.post('http://localhost:5000/credentials');
    const { apiKey, apiSecret } = response.data;
    this.config.OpenTok.apiKey = apiKey;
    this.config.OpenTok.apiSecret = apiSecret;
  },
};
</script>

<style lang="scss">
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
</style>
