import state from './state';
import actions from './actions';
import mutations from './mutations';
import callControls from '../CallControls/store/modules';
import videoSession from '../VideoSession/store/modules';
import chat from '../Chat/store/modules';

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  modules: {
    callControls,
    videoSession,
    chat,
  },
};
