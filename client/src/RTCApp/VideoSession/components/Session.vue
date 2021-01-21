<template>
  <ul id="session" @error="errorHandler">
    <Publisher
      :session="session"
      :options="publisherOptions"
      :isScreensharing="isScreensharing"
      @error="errorHandler"
    />

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
import { mapState } from 'vuex';
import OT from '@opentok/client';
import Publisher from './Publisher.vue';
import Subscriber from './Subscriber.vue';

export default {
  name: 'Session',
  components: { Publisher, Subscriber },
  props: {
    apiKey: { type: String, required: true },
    sessionId: { type: String, required: true },
    token: { type: String, required: true },
  },
  data() {
    return {
      session: null,
      streams: [],
    };
  },
  computed: {
    ...mapState('rtcApp/videoSession', [
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
    this.session = OT.initSession(this.apiKey, this.sessionId);

    this.session.connect(this.token, (error) => {
      if (error) this.errorHandler(error);
    });

    this.session.on('streamCreated', (event) => {
      this.streams.push(event.stream);
    });

    this.session.on('streamDestroyed', (event) => {
      const streamIdx = this.streams.indexOf(event.stream);

      if (streamIdx > -1) {
        this.streams.splice(streamIdx, 1);
      }
    });
  },
  methods: {
    errorHandler(error) {
      console.log(error);
    },
  },
};
</script>
