<template>
  <section class="bubble">
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'Bubble',
};
</script>

<style lang="scss" scoped>
@import "../sass/variables.scss";

.bubble {
  display: none;
  position: absolute;
  z-index: 2000;
  opacity: 0;
  transition: opacity $transition-time;

  &.show {
    opacity: 1;
  }

  &.visible {
    display: block;
  }
}
</style>
