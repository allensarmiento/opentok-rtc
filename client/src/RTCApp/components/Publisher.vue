<template>
  <li>
    <div class="controls">
      <div class="buttons">
        <div><i></i></div>
      </div>
    </div>
  </li>
</template>

<script>
import OT from '@opentok/client';

export default {
  name: 'Publisher',
  props: {
    session: { type: OT.session, required: true },
    options: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      publisher: null,
    };
  },
  watch: {
    options(publisherOptions) {
      const { publishAudio, publishVideo } = publisherOptions;
      this.publisher.publishAudio(publishAudio);
      this.publisher.publishVideo(publishVideo);
    },
  },
  mounted() {
    this.publisher = OT.initPublisher(this.$el, this.options, (err) => {
      if (err) {
        this.$emit('error', err);
      } else {
        this.$emit('publisherCompleted');
      }
    });

    this.$emit('publisherCreated', this.publisher);

    const publish = () => {
      this.session.publish(this.publisher, (err) => {
        if (err) {
          this.$emit('error', err);
        } else {
          this.$emit('publisherConnected', this.publisher);
        }
      });
    };

    if (this.session && this.session.isConnected()) {
      publish();
    }

    if (this.session) {
      this.session.on('sessionConnected', publish);
    }
  },
};
</script>

<style lang="scss" scoped>
.controls {
  top: 4rem;
  left: 4rem;
}

.button {
  padding: 1.5rem;
}
</style>
