<template>
  <div class="cell">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ContainerCell',
};
</script>

<style lang="scss" scoped>
.cell {
  display: table-cell;
  vertical-align: middle;
}
</style>
