<template>
  <Session
    v-if="credentialsValid"
    :apiKey="config.OpenTok.apiKey"
    :sessionId="sessionId"
    :token="token"
  />
</template>

<script>
import { mapState } from 'vuex';
import Session from './Session.vue';
import { getSessionCredentials } from '../api/video';

export default {
  name: 'VideoSession',
  components: { Session },
  data() {
    return {
      sessionId: '',
      token: '',
    };
  },
  computed: {
    ...mapState('rtcApp', ['config', 'roomName']),
    credentialsValid() {
      return this.config.OpenTok.apiKey && this.sessionId && this.token;
    },
  },
  mounted() {
    const endpoint = `${this.config.serverEndpoint}/room/${this.roomName}/info`;
    console.log(endpoint);
    getSessionCredentials(
      endpoint,
      this.config.OpenTok.apiKey,
      this.config.OpenTok.apiSecret,
      this.roomName,
    ).then((credentials) => {
      const { sessionId, token } = credentials;
      this.sessionId = sessionId;
      this.token = token;
    });
  },
};
</script>
