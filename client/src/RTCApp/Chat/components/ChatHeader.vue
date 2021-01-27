<template>
  <header class="header">
    <div class="container">
      <DataIcon dataIcon="message-blue" />
      <span class="title">Messaging</span>
    </div>

    <DataIcon dataIcon="close-blue" />
  </header>
</template>

<script>
import DataIcon from '../../ui/DataIcon.vue';

export default {
  name: 'ChatHeader',
  components: { DataIcon },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  height: 8.5rem;
  width: 100%;
  background-color: #3f4f57;
  color: #728a95;
  font-size: 1.6rem;
  text-align: left;
}

.container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

::v-deep [data-icon="message-blue"] {
  height: 2.7rem;
  width: 3.2rem;
  margin-left: 2.6rem;
  margin-right: 1.4rem;
  background-image: url(../assets/message-blue.svg);
}

.title {
  display: inline-block;
  line-height: 6rem;
}

::v-deep [data-icon="close-blue"] {
  height: 1.9rem;
  width: 1.9rem;
  margin-right: 2.6rem;
  background-image: url(../assets/close-blue.svg);
  cursor: pointer;
}
</style>
