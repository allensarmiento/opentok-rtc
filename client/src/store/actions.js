export default {
  setConfig(context, config) {
    context.commit('setConfig', config);
  },
  mouseoverCallControls(context, value) {
    context.commit('mouseoverCallControls', value);
  },
};
