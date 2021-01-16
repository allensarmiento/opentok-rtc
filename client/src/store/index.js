import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
import RTCAppModules from '../RTCApp/store/modules';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    RTCAppPrev: modules, // TODO: Remove after refactor
    RTCApp: RTCAppModules,
  },
});
