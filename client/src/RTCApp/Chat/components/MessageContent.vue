<template>
  <p :class="[
    'content',
    isYourself ? 'yourself' : 'event',
  ]">
    <slot></slot>
  </p>
</template>

<script>
export default {
  name: 'MessageContent',
  props: {
    isYourself: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
.yourself {
  margin-left: 4rem;
  margin-right: 0;
  border-right: .2rem solid #10a9dc;
  text-align: right;

  & > p {
    text-align: left;
  }
}

.event {
  margin-right: 0;
  background: none;
}
</style>
