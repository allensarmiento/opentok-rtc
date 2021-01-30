<template>
  <li :class="[
    'message',
    isYourself ? 'yourself' : 'event',
  ]">
    <MessageContent :isYourself="isYourself">
      {{ messsage.content }}
    </MessageContent>
  </li>
</template>

<script>
import MessageContent from './MessageContent.vue';

export default {
  name: 'ChatMessage',
  components: { MessageContent },
  props: {
    message: { type: Object, default: () => ({}) },
  },
  computed: {
    isYourself() {
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  align-self: flex-start;
  position: relative;
  width: fit-content;
  padding: 1rem 3rem 1rem 2rem;
  box-sizing: border-box;
  background-color: transparent;
  color: #3f4f57;
  border: 0;
  font-size: 1.2rem;
  line-height: 1.4rem;
}

.yourself {
  align-self: flex-end;
}

.event {
  align-self: center;
  color: #a7a0a0;
}
</style>
