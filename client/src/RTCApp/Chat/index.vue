<template>
  <section :class="[
    'chat',
    show ? 'show' : '',
    visible ? 'visible' : '',
  ]">
    <DialogChat>
      <ChatHeader />

      <div id="chatMsgs" class="tc-list">
        <ul></ul>
      </div>

      <footer>
        <textarea
          id="msgText"
          placeholder="Type your message..."
          required
        ></textarea>

        <button
          id="sendTxt"
          type="submit"
          data-icon="send"
          class="btn btn-blue btn-padding btn-padding-small"
        ></button>
      </footer>
    </DialogChat>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import DialogChat from './components/DialogChat.vue';
import ChatHeader from './components/ChatHeader.vue';

export default {
  name: 'Chat',
  components: { DialogChat, ChatHeader },
  computed: {
    ...mapState('rtcApp/chat', ['show', 'visible']),
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
  width: 0rem;
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
</style>
