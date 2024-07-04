import Vue from 'vue';
import Vuex from 'vuex';
import vuexModules from './modules';
import apiModules from './apiModules';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    ...vuexModules,
    ...apiModules
  }
});
