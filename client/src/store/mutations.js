export default {
  setConfig(state, config) {
    state.config = config;
  },
  mouseoverCallControls(state, value) {
    state.callControls.show = value;
  },
};
