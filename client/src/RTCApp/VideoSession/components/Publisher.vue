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
    session: { type: OT.session },
    options: { type: Object, default: () => ({}) },
  },
  mounted() {
    const publisher = OT.initPublisher(this.$el, this.options, (error) => {
      if (error) {
        this.$emit('error', error);
      } else {
        this.$emit('publisherCompleted');
      }
    });

    this.$emit('publisherCreated', publisher);
    const publish = () => {
      this.session.publish(publisher, (error) => {
        if (error) {
          this.$emit('error', error);
        } else {
          this.$emit('publisherConnected', publisher);
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
