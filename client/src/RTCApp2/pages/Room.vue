<template>
  <div class="room" style="height: 98vh">
    <TopBanner />
    <Screen />
    <FeedbackButton v-if="config.feedbackUrl" />
    <Chat />
  </div>
</template>

<script>
import TopBanner from '../components/top-banner/TopBanner.vue';
import Screen from '../components/screen/Screen.vue';
import FeedbackButton from '../components/feedback/FeedbackButton.vue';
import Chat from '../components/chat/Chat.vue';

export default {
  name: 'Room',
  props: {
    config: { type: Object, default: () => ({}) },
  },
  components: {
    TopBanner,
    Screen,
    FeedbackButton,
    Chat,
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
