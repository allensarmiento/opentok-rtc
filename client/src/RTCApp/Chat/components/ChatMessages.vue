<template>
  <div class="container">
    <ul class="messages">
      <ChatMessage
        v-for="message in chatMessages"
        :key="message.id"
        :message="message"
      />
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ChatMessage from './ChatMessage.vue';

export default {
  name: 'ChatMessages',
  components: { ChatMessage },
  computed: {
    ...mapState('rtcApp/videoSession', ['chatMessages']),
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: block;
  height: calc("100% - 200px");
  width: calc("100% - 15px");
  overflow: auto;
}

.messages {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: min-content;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
