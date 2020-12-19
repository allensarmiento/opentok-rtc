<template>
  <Session
    v-if="validCredentials"
    :apiKey="apiKey"
    :sessionId="sessionId"
    :token="token"
  />
</template>

<script>
import axios from 'axios';
import Session from './Session.vue';

export default {
  name: 'Video',
  components: { Session },
  props: {
    apiKey: { type: String, default: '' },
    apiSecret: { type: String, default: '' },
    roomName: { type: String, default: 'test' },
  },
  data() {
    return {
      sessionId: '',
      token: '',
    };
  },
  computed: {
    validCredentials() {
      return this.apiKey && this.sessionId && this.token;
    },
  },
  async mounted() {
    console.log(`ApiKey: ${this.apiKey}`);
    const response = await axios
      .post(`http://localhost:5000/room/${this.roomName}/info`, {
        apiKey: this.apiKey,
        apiSecret: this.apiSecret,
        roomName: this.roomName,
      });
    const { sessionId, token } = response.data;
    this.sessionId = sessionId;
    this.token = token;
  },
};
</script>

<style lang="scss" scoped>

</style>
