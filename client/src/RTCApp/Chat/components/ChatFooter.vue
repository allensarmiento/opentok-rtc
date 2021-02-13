<template>
  <footer class="footer">
    <textarea
      @keydown.enter="onSendClicked"
      v-model="message"
      id="msgText"
      class="input"
      placeholder="Type your message..."
      required
    ></textarea>

    <button
      @click="onSendClicked"
      id="sendTxt"
      type="submit"
      data-icon="send"
      :class="[
        'submit',
        'btn',
        'btn-blue',
        'btn-padding',
        'btn-padding-small'
      ]"
      class="btn btn-blue btn-padding btn-padding-small"
    ></button>
  </footer>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ChatFooter',
  data() {
    return {
      message: '',
    };
  },
  methods: {
    ...mapActions('rtcApp', ['addChatMessage']),
    onSendClicked() {
      if (this.message) {
        this.addChatMessage(this.message);
        this.message = '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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

.submit {
  position: absolute;
  right: 2.5rem;
  bottom: 2.7rem;
  height: 6rem;
  width: 6rem;
  margin: 0;
  background-color: #10a9dc;
  background-size: 2.8rem 2.8rem;
  box-shadow: 0 .2rem .4rem 0 rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  line-height: 2.5rem;
}

::v-deep [data-icon="send"] {
  background-image: url(../assets/send.svg);
}
</style>
