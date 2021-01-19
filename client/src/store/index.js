import Vue from 'vue';
import Vuex from 'vuex';
import rtcApp from '../RTCApp/store/modules';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    rtcApp,
  },
});
