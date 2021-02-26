<template>
  <div class="container">
    <ul class="messages">
      <li
        v-for="message in messages"
        :key="message.id"
        :class="['message', messageType]"
      >
        <p :class="['content', messageType]">
          {{ message.data }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ChatMessages',
  props: { messages: Array, default: () => ([]) },
  computed: {
    messageType() {
      // yourself or event
      return 'yourself';
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: block;
  height: calc(100% - 200px);
  width: calc(100% - 15px);
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

  &.yourself {
    align-self: flex-end;
  }

  &.event {
    align-self: center;
    color: #a7a0a0;
  }
}

.content {
  &.yourself {
    margin-left: 4rem;
    margin-right: 0;
    border-right: .2rem solid #10a9dc;
    text-align: right;

    & > p {
      text-align: left;
    }
  }

  &.event {
    margin-right: 0;
    background: none;
  }
}
</style>
