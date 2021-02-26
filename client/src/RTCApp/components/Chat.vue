<template>
  <section :class="[
    'chat',
    showChat ? 'show' : '',
    visibleChat ? 'visible' : '',
  ]">
    <form class="form" @submit.prevent>
      <header class="header">
        <div class="container">
          <DataIcon dataIcon="message-blue" />
          <span class="title">Messaging</span>
        </div>
        <DataIcon dataIcon="close-blue" @click.native="setVisibleChat(false)" />
      </header>
      <ChatMessages :messages="chatMessages" />
      <footer class="footer">
        <textarea
          v-model="message"
          class="input"
          placeholder="Type your message..."
          required
          @keydown.enter="onSendMessage"
        />
        <button
          type="submit"
          class="submit-btn"
          data-icon="send"
          @click="onSendMessage"
        />
      </footer>
    </form>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import DataIcon from '../ui/DataIcon.vue';
import ChatMessages from './ChatMessages.vue';

export default {
  name: 'Chat',
  components: { DataIcon, ChatMessages },
  computed: {
    ...mapState('rtcApp', ['showChat', 'visibleChat', 'chatMessages']),
  },
  data() {
    return { message: '' };
  },
  methods: {
    ...mapActions('rtcApp', ['setVisibleChat', 'addChatMessage']),
    onSendMessage() {
      if (this.message) {
        this.addChatMessage(this.message);
        this.message = '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/variables.scss";
@import "../sass/mixins.scss";

.chat {
  display: none;
  right: 0;
  bottom: 0;
  width: 0;
  margin-top: 10rem;
  background-color: #e7e7e7;
  font-size: 0;
  z-index: 1000;
  transition: width $transition-time;

  @include for-size(smartphones-portrait) {
    margin-top: 5.8rem;
    margin-left: -.4rem;
  }
}

.show {
  width: 48.6rem;
  transition: width $transition-time;
}

.visible {
  display: block;
}

.form {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.header {
  display: flex;
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

.footer {
  display: flex;
  height: 11.5rem;
  background-color: #fafafa;
  font-size: 1.2rem;
  text-align: center;
  overflow: hidden;
}

.input {
  height: 8rem;
  width: 100%;
  margin: 0;
  padding: 3rem 9rem 3rem 2rem;
  border: none;
  font-size: 1.6rem;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #b8b6b6;
  }
}

.submit-btn {
  position: absolute;
  right: 2.5rem;
  bottom: 2.7rem;
  height: 6rem;
  width: 6rem;
  margin: 0;
  background-color: #10a9dc;
  background-size: 2.8rem 2.8rem;
  box-shadow: 0 .2rem .4rem 0 rgba(0, 0, 0, .5);
  border-radius: 50%;
  line-height: 2.5rem;
}

[data-icon="send"] {
  background-image: url(../assets/send.svg);
}
</style>
