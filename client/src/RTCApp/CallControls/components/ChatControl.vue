<template>
  <ControlsButton
    id="message-btn"
    @click.native="setShowChat(!showChat)"
  >
    <template v-slot:button>
      <DataIcon dataIcon="message" />
    </template>
    <template v-slot:description>
      Message &nbsp;
      <span id="unreadMsg">
        (<span id="unreadCount">{{ unreadMessages.length }}</span>)
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
    showChat(shouldShow) {
      if (shouldShow) {
        setTimeout(() => {
          this.setVisibleChat(true);
        }, 50);
      }
    },
    visibleChat(isVisible) {
      if (!isVisible) {
        setTimeout(() => {
          this.setShowChat(false);
        }, 50);
      }
    },
  },
  computed: {
    ...mapState('rtcApp', [
      'showChat',
      'visibleChat',
      'unreadMessages',
    ]),
  },
  methods: {
    ...mapActions('rtcApp', [
      'setShowChat',
      'setVisibleChat',
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
