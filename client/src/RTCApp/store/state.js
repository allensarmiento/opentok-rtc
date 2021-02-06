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

  username: 'anonymous',
  roomName: 'test',

  layoutType: 'hangout_vertical',
});
