export default () => ({
  // Configuration
  config: {
    serverEndpoint: '',
    showTos: false,
    OpenTok: {
      apiKey: '',
      apiSecret: '',
    },
    Archiving: {
      enabled: false,
      archiveManager: {
        enabled: false,
      },
    },
    Feedback: {
      url: '',
      reportIssueLevel: 0,
    },
    Screensharing: {
      enabled: true,
      chromeExtensionId: null,
      annotations: {
        enabled: true,
      },
    },
  },
  
  isWebRTCVersion: false,
  username: 'anonymous',
  roomName: '',
  layoutType: 'hangout_vertical',

  // Call Controls
  showControls: false,
  visibleControls: false,
  overControls: false,
  hideControlsTimer: null,

  // Chat
  showChat: false,
  visibleChat: false,
  unreadMessages: [],
  chatInput: '',

  // Video Session
  session: null,
  streams: [],
  chatMessages: [],
  publishAudio: false,
  publishVideo: false,
  isScreensharing: false,
});
