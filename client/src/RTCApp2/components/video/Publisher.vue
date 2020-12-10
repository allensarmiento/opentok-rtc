<template>
  <div></div>
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

    });
  },
};
</script>

<style lang="scss" scoped>

</style>
