<template>
  <li></li>
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
    const publisher = this.createPublisher();
    this.$emit('publisherCreated', publisher);

    if (this.session) {
      if (this.session.isConnected()) this.publish(publisher);

      this.session.on('sessionConnected', this.publish);
    }
  },
  methods: {
    createPublisher() {
      const publisher = OT.initPublisher(this.$el, this.options, (error) => {
        if (error) this.$emit('error', error);
        else this.$emit('publisherCompleted');
      });
      return publisher;
    },
    publish(publisher) {
      this.session.publish(publisher, (error) => {
        if (error) this.$emit('error', error);
        else this.$emit('publisherConnected', publisher);
      });
    },
  },
};
</script>
