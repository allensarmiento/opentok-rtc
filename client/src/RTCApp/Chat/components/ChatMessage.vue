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
    }
  },
};
</script>

<style lang="scss" scoped>
.message {
  position: relative;
  padding: 1.2rem 1.5rem;
  box-sizing: border-box;
  background-color: #d1d9dd;
  border-bottom: .1rem solid #e5eaec;
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
