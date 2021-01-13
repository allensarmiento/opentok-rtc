export default () => ({
  config: {
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
  callControls: {
    show: false,
    visible: false,
    over: false,
    hideTimer: null,
  },
  roomName: 'test',
});
