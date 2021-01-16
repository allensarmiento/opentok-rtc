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
.container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  float: right;
  right: 0;
}
</style>
