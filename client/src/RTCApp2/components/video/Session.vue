<template>
  <div></div>
</template>

<script>
import OT from '@opentok/client';

export default {
  name: 'Session',
  props: {
    apiKey: { type: String, default: '' },
    sessionId: { type: String, default: '' },
    token: { type: String, default: '' },
  },
  data() {
    return {
      session: null,
      streams: [],
    };
  },
  created() {
    this.session = OT.initSession(this.apiKey, this.sessionId);

    this.session.connect(this.token, (error) => {
      if (error) console.log(error);
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
};
</script>

<style lang="scss" scoped>

</style>
