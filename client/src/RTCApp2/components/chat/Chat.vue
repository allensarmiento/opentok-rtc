<template>
  <section id="chat" class="chat">
    <form id="chatForm" class="chat__form">
      <header class="chat__header">
        <div class="chat__title">
          <DataIcon dataIcon="message_blue" />
          <span class="chat__title__text">Messaging</span>
        </div>
        <DataIcon id="closeChat" dataIcon="close_blue" />
      </header>

      <div id="chatMsgs" class="chat__messages">
        <ul></ul>
      </div>

      <footer class="chat__footer">
        <textarea
          id="msgText"
          class="chat__input"
          placeholder="Type your message..."
          required
        />
        <BlueButton id="sendTxt" class="chat__send" type="submit">
          <DataIcon dataIcon="send" />
        </BlueButton>
      </footer>
    </form>
  </section>
</template>

<script>
import BlueButton from '../core/BlueButton.vue';
import DataIcon from '../core/DataIcon.vue';

export default {
  name: 'Chat',
  components: { BlueButton, DataIcon },
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";
@import "../../sass/variables.scss";

.chat {
  display: none;
  right: 0;
  bottom: 0;
  width: 0;
  margin-top: 10rem;
  background-color: #e7e7e7;
  z-index: 1000;
  font-size: 0;
  transition: width $transition-time;

  &.show {
    width: 48.6rem;
    transition: width $transition-time;
  }

  &.visible {
    display: block;
  }

  // TODO: dialog-chat
  &__form {}

  &__header {}

  &__title {
    &__text {}
  }

  &__messages {}

  &__footer {}

  &__input {}

  &__send {}

  @include for-size(smartphones-portrait) {
    margin-left: -.4rem;
    margin-top: 5.8rem;
  }
}
</style>
