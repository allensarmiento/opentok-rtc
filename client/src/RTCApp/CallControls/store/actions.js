export default {
  mouseover(context, value) {
    context.commit('mouseover', value);
  },

  setVisible({ commit }, value) {
    commit('setVisible', value);
  },
  setOver({ commit }, value) {
    commit('setOver', value);
  },
  setHideTimer({ commit }, value) {
    commit('setHideTimer', value);
  },
};
