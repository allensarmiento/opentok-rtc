<template>
  <ul @error="errorHandler">
    <Publisher
      :session="session"
      :options="publisherOptions"
      :isScreensharing="isScreensharing"
      @error="errorHandler"
    />
    <Screenshare :session="session" :isScreensharing="isScreensharing" />
    <Subscriber
      v-for="stream in streams"
      :key="stream.streamId"
      :session="session"
      :stream="stream"
      @error="errorHandler"
    />
  </ul>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Publisher from './Publisher.vue';
import Screenshare from './Screenshare.vue';
import Subscriber from './Subscriber.vue';

export default {
  name: 'Session',
  components: {
    Publisher,
    Screenshare,
    Subscriber,
  },
  props: {
    apiKey: { type: String, required: true },
    sessionId: { type: String, required: true },
    token: { type: String, required: true },
  },
  computed: {
    ...mapState('rtcApp', [
      'username',
      'session',
      'streams',
      'chatMessages',
      'publishAudio',
      'publishVideo',
      'isScreensharing',
    ]),
    publisherOptions() {
      return {
        publishAudio: this.publishAudio,
        publishVideo: this.publishVideo,
      };
    },
  },
  created() {
    this.createSession({
      apiKey: this.apiKey,
      sessionId: this.sessionId,
      token: this.token,
      username: this.username,
    });
  },
  methods: {
    ...mapActions('rtcApp', ['createSession']),
    errorHandler(error) {
      console.log(error);
    },
  },
};
</script>
