<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'RightContainer',
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";

.container {
  display: table;
  position: absolute;
  right: 0;
  height: 100%;
  width: 49.8rem;

  @include for-size(smartphones-portrait) {
    width: 100%;
  }
}
</style>
