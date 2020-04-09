import Vue from 'vue';
import Vuex from 'vuex';
import { MutationTree, GetterTree } from 'vuex';
import { commonModule } from './modules/common';
import createPersistedState from 'vuex-persistedstate';
import { MainState, RootState } from '../typings/store';

Vue.use(Vuex);

const mutations: MutationTree<MainState> = {};
const state: MainState = {};

//eslint-disable-next-line
export const getters: GetterTree<MainState, RootState> = {};

export default new Vuex.Store<MainState>({
  state,
  mutations,
  modules: {
    commonModule,
  },
  plugins: [createPersistedState()],
});
