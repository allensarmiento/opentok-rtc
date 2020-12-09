<template>
  <section id="chat" class="chat">
    <form id="chatForm" class="chat__form">
      <header class="chat__header">
        <div class="chat__title">
          <DataIcon dataIcon="message_blue" />
          <span class="chat__title__text">Messaging</span>
        </div>
        <DataIcon
          id="closeChat"
          className="chat__close"
          dataIcon="close_blue"
        />
      </header>

      <div id="chatMsgs" class="chat__messages">
        <ul class="chat__messages__list"></ul>
      </div>

      <footer class="chat__footer">
        <textarea
          id="msgText"
          class="chat__input"
          placeholder="Type your message..."
          required
        />
        <BlueButton
          id="sendTxt"
          className="chat__send"
          padding="small"
          dataIcon="send"
          type="submit"
        ></BlueButton>
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

  &__form {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    height: 8.5rem;
    width: 100%;
    padding: 0 1rem;
    background-color: #3f4f57;
    color: #728a95;
    font-size: 1.6rem;
    text-align: left;
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    &__text {
      display: inline-block;
      margin-left: 1rem;
      line-height: 6rem;
    }
  }

  &__close {
    height: 1.9rem;
    width: 1.9rem;
    margin-right: 2.6rem;
    cursor: pointer;
  }

  &__messages {
    display: block;
    height: calc(100% - 20rem);
    width: calc(100% + 1.5rem);
    overflow-y: auto;

    &__list {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      min-height: min-content;
      width: 100%;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    // TODO: List items
  }

  &__footer {
    display: flex;
    height: 11.5rem;
    background-color: #fafafa;
    font-size: 1.2rem;
    text-align: center;
    overflow: hidden;
  }

  &__input {
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

  &__input:invalid &__send {
    background-color: #c6c5c5;
    pointer-events: none;
  }

  &__send {
    position: absolute;
    right: 2.5rem;
    bottom: 2.7rem;
    height: 6rem;
    width: 6rem;
    margin: 0;
    padding: 0;
    background-color: #10a9dc;
    background-size: 2.8rem 2.8rem;
    border-radius: 50%;
    box-shadow: 0 .2rem .4rem 0 rgba(0, 0, 0, 0.5);
    line-height: 2.5rem;
  }

  @include for-size(smartphones-portrait) {
    margin-left: -.4rem;
    margin-top: 5.8rem;
  }
}
</style>
