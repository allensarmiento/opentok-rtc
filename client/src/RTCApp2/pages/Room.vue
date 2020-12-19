<template>
  <div class="room" style="height: 98vh">
    <TopBanner />
    <Screen
      :config="config"
      :opentokApiKey="opentokApiKey"
      :opentokApiSecret="opentokApiSecret"
    />
    <FeedbackButton v-if="config.feedbackUrl" />
    <Chat />
    <ScreenShareErrors v-if="false" />
    <Bubbles v-if="false" />

    <!--
      TODO:
        - Feedback report modal
        - Archive delete modal
        - Add to call modal
        - Switch alert modal
    -->
  </div>
</template>

<script>
import TopBanner from '../components/top-banner/TopBanner.vue';
import Screen from '../components/screen/Screen.vue';
import FeedbackButton from '../components/feedback/FeedbackButton.vue';
import Chat from '../components/chat/Chat.vue';
import ScreenShareErrors from '../components/screen-share/Errors.vue';
import Bubbles from '../components/bubbles/Bubbles.vue';

export default {
  name: 'Room',
  props: {
    config: { type: Object, default: () => ({}) },
    opentokApiKey: { type: String, default: '' },
    opentokApiSecret: { type: String, default: '' },
  },
  components: {
    TopBanner,
    Screen,
    FeedbackButton,
    Chat,
    ScreenShareErrors,
    Bubbles,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
@import "../sass/variables.scss";
@import "../sass/base.scss";

.room {
  display: flex;
  position: relative;
  margin: 0;
  color: #fff;
  background-color: $main-background-color;
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>
