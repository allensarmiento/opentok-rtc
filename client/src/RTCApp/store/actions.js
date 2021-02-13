export default {
  // Configuration
  setConfig(context, config) {
    context.commit('setConfig', config);
  },

  // Call Controls
  mouseoverControls({ commit }, shouldShow) {
    commit('mouseoverControls', shouldShow);
  },
  setVisibleControls({ commit }, isVisible) {
    commit('setVisibleControls', isVisible);
  },
  setOverControls({ commit }, isOverControls) {
    commit('setOverControls', isOverControls);
  },
  setHideControlsTimer({ commit }, timer) {
    commit('setHideControlsTimer', timer);
  },

  // Chat
  setShowChat({ commit }, shouldShow) {
    commit('setShowChat', shouldShow);
  },
  setVisibleChat({ commit }, isVisible) {
    commit('setVisibleChat', isVisible);
  },
  setUnreadMessages() {},
  setChatInput({ commit }, content) {
    commit('setChatInput', content);
  },

  // Video Session
  createSession({ commit }, credentials) {
    commit('createSession', credentials);
  },
  setChatMessages({ commit }, messages) {
    commit('setChatMessages', messages);
  },
  addChatMessage({ commit }, message) {
    commit('addChatMessage', message);
  },
  setPublishAudio({ commit }, shouldPublish) {
    commit('setPublishAudio', shouldPublish);
  },
  setPublishVideo({ commit }, shouldPublish) {
    commit('setPublishVideo', shouldPublish);
  },
  setIsScreensharing({ commit }, isScreensharing) {
    commit('setIsScreensharing', isScreensharing);
  },
};
