<template>
  <Session
    v-if="credentialsValid"
    :apiKey="config.OpenTok.apiKey"
    :sessionId="sessionId"
    :token="token"
  />
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import Session from './components/Session.vue';

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
  async mounted() {
    const endpoint = `http://localhost:5000/room/${this.roomName}/info`;
    try {
      const response = await axios.post(endpoint, {
        apiKey: this.config.OpenTok.apiKey,
        apiSecret: this.config.OpenTok.apiSecret,
        roomName: this.roomName,
      });
      this.sessionId = response.data.sessionId;
      this.token = response.data.token;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
