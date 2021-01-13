<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'CenterContainer',
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";

.container {
  float: left;
  flex-grow: 1;
  height: 100%;
  padding-left: 3rem;

  @include for-size(smartphones-portrait) {
    max-width: 13rem;
    padding: 0;
    padding-left: 1.7rem;
  }
}
</style>
