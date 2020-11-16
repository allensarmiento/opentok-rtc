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

    <Precall v-if="showPrecall" />
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
import Precall from '../components/Precall/Precall.vue';

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
    Precall,
  },
  data() {
    return {
      otHelper: null,
      resolutionAlgorithm: null,
      debugPreferredResolution: null,
      enableHangoutScroll: false,

      // !
      showPrecall: false,

      roomName: '',
      username: '',
    };
  },
  mounted() {
    this.initializePrecall();
    this.initializeOTHelper();
    this.getRoomParams();
  },
  methods: {
    initializePrecall() {
      this.showPrecall = true;
    },
    initializeOTHelper() {
      this.otHelper = new OTHelper();
    },
    getRoomParams() {
      // Room URL.
      const pathNameArr = BrowserUtils
        .splitPathName(document.location.pathname);
      const roomURI = BrowserUtils.getRoomURI(pathNameArr);
      this.roomName = BrowserUtils.decodeStr(roomURI);

      // Recover user identifier.
      const params = BrowserUtils.parseSearch(document.location.search);
      const userId = BrowserUtils
        .getFirstValFromObjKey(params, 'userName');

      // Room variables.
      this.resolutionAlgorithm = BrowserUtils
        .getFirstValFromObjKey(params, 'userName');
      this.debugPreferredResolution = BrowserUtils
        .getFirstValFromObjKey(params, 'debugPreferredResolution');
      this.enableHangoutScroll = BrowserUtils
        .getFirstValFromObjKey(params, 'enableHangoutScroll') !== undefined;

      // Startup precall.
      console.log(`${params}: ${userId}`);
    },
  },
};
</script>
