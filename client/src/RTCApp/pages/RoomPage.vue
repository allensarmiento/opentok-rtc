<template>
  <!-- <div class="room forbidden"> -->
  <div class="room">
    <TopBanner
      :visible="roomVisibility.topBanner"
      :roomName="roomName"
      :roomURI="roomURI"
    />
    <Screen :visible="roomVisibility.screen" :otHelper="otHelper" />
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
import * as BrowserUtils from '../utilities/browserUtils';
import * as Request from '../helpers/request';

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
      resolutionAlgorithm: null,
      debugPreferredResolution: null,
      enableHangoutScroll: false,

      // ! For Precall
      showPrecall: false,

      roomName: '',
      roomURI: '',
      username: '',
      enableAnnotations: true,
      enableArchiveManager: false,
      enableSip: false,
      requireGoogleAuth: false, // For SIP dial-out

      roomVisibility: {
        topBanner: '',
        screen: '',
      },
    };
  },
  async mounted() {
    this.initializePrecall();
    this.initializeOTHelper();
    this.getRoomParams();

    // ! Receive room info: Below is a placeholder.
    const info = this.getInfo();

    const params = await this.getRoomInfo(info);
    console.log(params);

    this.showRoom();
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
      this.roomURI = BrowserUtils.getRoomURI(pathNameArr);
      this.roomName = BrowserUtils.decodeStr(this.roomURI);

      // Recover user identifier.
      const { params } = BrowserUtils.parseSearch(document.location.search);
      this.username = BrowserUtils
        .getFirstValFromObjKey(params, 'userName');

      // Room variables.
      this.resolutionAlgorithm = BrowserUtils
        .getFirstValFromObjKey(params, 'resolutionAlgorithm');
      this.debugPreferredResolution = BrowserUtils
        .getFirstValFromObjKey(params, 'debugPreferredResolution');
      this.enableHangoutScroll = BrowserUtils
        .getFirstValFromObjKey(params, 'enableHangoutScroll') !== undefined;

      // Precall show call settings prompt.
      // ! Will do this later on.
      console.log(`${params}`);

      // After precall show call settings prompt.
    },
    showRoom() {
      this.roomVisibility.topBanner = 'visible';
      this.roomVisibility.screen = 'visible';
    },
    getRoomInfo(roomParams) {
      return Request.getRoomInfo(roomParams)
        .then((roomInfo) => {
          const {
            apiKey,
            sessionId,
            token,
            username,
            enableArchiveManager,
            firebaseToken,
            firebaseURL,
            enableAnnotations,
            enableSip,
            requireGoogleAuth,
          } = roomInfo;

          const credentialsValid = apiKey && sessionId && token;
          const roomInvalid = !(roomInfo && credentialsValid && username);
          const archiveInvalid = enableArchiveManager
            && (!firebaseToken || !firebaseURL);

          if (roomInvalid || archiveInvalid) {
            console.error(
              `Error getRoomParams [${roomInfo}] without correct response`,
            );
            throw new Error('Error getting room parameters.');
          }

          const { roomURI, publishAudio, publishVideo } = roomParams;
          const newRoomInfo = { ...roomInfo };
          newRoomInfo.roomURI = roomURI;
          newRoomInfo.publishAudio = publishAudio;
          newRoomInfo.publishVideo = publishVideo;

          this.enableAnnotations = enableAnnotations;
          this.enableArchiveManager = enableArchiveManager;
          this.enableSip = enableSip;
          this.requireGoogleAuth = requireGoogleAuth;

          return newRoomInfo;
        });
    },

    // ! To remove later
    getInfo() {
      return {
        tbConfig: {
          apiKey: process.env.VUE_APP_TB_API_KEY,
          apiSecret: process.env.VUE_APP_TB_API_SECRET,
          requireGoogleAuth: false,
          googleId: '',
          reportIssueLevel: 1,

          opentokJsUrl: 'https://static.opentok.com/v2/js/opentok.min.js',

          allowIframing: 'never',
          isWebRTCVersion: false,
          showTos: false,
          chromeExtensionId: null,
          iosAppId: null,

          enableArchiving: true,
          enableArchiveManager: false,
          archiveAlways: false,
          enableScreenSharing: true,
          enableAnnotations: true,
          enableFeedback: false,
          enableSip: false,
          googleHostedDomain: '',

          // Sessions should not live forever. So we'll store the last time a
          // session was used and if when we fetch it from Redis we determine
          // it's older than this max age (in days). This is the key where that
          // value (in days) should be stored. By default, sessions live two
          // days.
          maxSessionAge: 2,
          maxSessionAgeMs: (2) * 24 * 60 * 60 * 1000,
        },
        redisRoomPrefix: '',
        roomURI: this.roomURI,
        roomName: this.roomName,
        username: this.username,
        mediaMode: 'relayed',
        newSession: 'yes',
      };
    },
  },
};
</script>
