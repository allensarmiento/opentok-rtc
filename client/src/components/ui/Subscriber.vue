<template>
  <li></li>
</template>

<script>
import OT from '@opentok/client';

export default {
  name: 'Subscriber',
  props: {
    stream: { type: OT.Stream, required: true },
    session: { type: OT.Session, required: true },
    options: { type: Object, default: () => ({}) },
  },
  mounted() {
    const subscriber = this.subscribe();
    this.$emit('subscriberCreated', subscriber);
  },
  methods: {
    subscribe() {
      const subscriber = this.session.subscribe(
        this.stream,
        this.$el,
        this.options,
        (error) => {
          if (error) this.$emit('error', error);
          else this.$emit('subscriberConnected', subscriber);
        },
      );

      return subscriber;
    },
  },
};
</script>
