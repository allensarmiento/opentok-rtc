export default {
  createSession({ commit }, value) {
    commit('createSession', value);
  },
  setChatMessages({ commit }, value) {
    commit('setChatMessages', value);
  },
  addChatMessage({ commit }, value) {
    commit('addChatMessage', value);
  },
  setPublishAudio({ commit }, value) {
    commit('setPublishAudio', value);
  },
  setPublishVideo({ commit }, value) {
    commit('setPublishVideo', value);
  },
  setIsScreensharing({ commit }, value) {
    commit('setIsScreensharing', value);
  },
};
