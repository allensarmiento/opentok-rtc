<template>
  <div class="pick">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SourcePick',
};
</script>

<style lang="scss" scoped>
@import "../sass/mixins.scss";

.pick {
  display: inline-block;
  min-width: 7rem;
  text-align: center;
  cursor: pointer;

  @include for-size(smartphones-portrait) {
    margin-top: -3.6rem;
    margin-right: .7rem;
  }
}
</style>
