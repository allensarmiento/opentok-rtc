<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'IconContainer',
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
  height: 100%;
  width: 26.9rem;
  min-width: 26.9rem;
  text-align: center;
  border-right: 1px solid #455b66;
}
</style>
