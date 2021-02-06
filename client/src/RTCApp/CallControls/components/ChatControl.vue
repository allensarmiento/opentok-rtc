<template>
  <ControlsButton id="message-btn" @click.native="setShow(!show)">
    <template v-slot:button>
      <DataIcon dataIcon="message" />
    </template>
    <template v-slot:description>
      Message &nbsp;
      <span id="unreadMsg">
        (<span id="unreadCount">{{ unread.length }}</span>)
      </span>
    </template>
  </ControlsButton>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ControlsButton from './ControlsButton.vue';
import DataIcon from '../../ui/DataIcon.vue';

export default {
  components: { ControlsButton, DataIcon },
  watch: {
    show(shouldShow) {
      if (shouldShow) {
        setTimeout(() => {
          this.setVisible(true);
        }, 50);
      }
    },
    visible(isVisible) {
      if (!isVisible) {
        setTimeout(() => {
          this.setShow(false);
        }, 50);
      }
    },
  },
  computed: {
    ...mapState('rtcApp/chat', [
      'show',
      'visible',
      'unread',
    ]),
  },
  methods: {
    ...mapActions('rtcApp/chat', [
      'setShow',
      'setVisible',
    ]),
  },
};
</script>

<style lang="scss" scoped>
::v-deep [data-icon="message"] {
  height: 2rem;
  width: 2.4rem;
  background-image: url(../assets/message.svg);
}
</style>
