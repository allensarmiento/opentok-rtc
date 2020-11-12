<template>
  <div class="forbidden">
    <TopBanner />
    <Screen />
    <!-- feedbackUrl -->
    <Chat />
    <ScreenShareErrors />
    <Bubbles />
    <FeedbackReport />
    <DeleteArchiveModal />
    <AddToCallModal />
    <SwitchAlertModal />
  </div>
</template>

<script>
import TopBanner from '../components/Room/TopBanner.vue';
import Screen from '../components/Room/Screen.vue';
import Chat from '../components/Room/Chat.vue';
import ScreenShareErrors from '../components/Room/ScreenShareErrors.vue';
import Bubbles from '../components/Room/Bubbles.vue';
import FeedbackReport from '../components/Room/FeedbackReport.vue';
import DeleteArchiveModal from '../components/Room/DeleteArchiveModal.vue';
import AddToCallModal from '../components/Room/AddToCallModal.vue';
import SwitchAlertModal from '../components/Room/SwitchAlertModal.vue';

import OTHelper from '../helpers/OTHelper';
import * as BrowserUtils from '../utilities/BrowserUtils';

export default {
  name: 'RoomPage',
  components: {
    TopBanner,
    Screen,
    Chat,
    ScreenShareErrors,
    Bubbles,
    FeedbackReport,
    DeleteArchiveModal,
    AddToCallModal,
    SwitchAlertModal,
  },
  data() {
    return {
      otHelper: null,
    };
  },
  mounted() {
    this.initializeOTHelper();
    this.getRoomParams();
  },
  methods: {
    initializeOTHelper() {
      this.otHelper = new OTHelper();
    },
    getRoomParams() {
      const pathNameArr = BrowserUtils
        .splitPathName(document.location.pathname);
      const roomURI = BrowserUtils.getRoomURI(pathNameArr);
      const roomName = BrowserUtils.decodeStr(roomURI);
      console.log(`${roomName}`);
    },
  },
};
</script>
