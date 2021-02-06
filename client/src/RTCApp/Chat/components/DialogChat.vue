<template>
  <form id="chatForm" class="dialog-chat" @submit.prevent>
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: 'DialogChat',
};
</script>

<style lang="scss" scoped>
.dialog-chat {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
