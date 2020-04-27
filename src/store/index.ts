import Vue from 'vue';
import Vuex from 'vuex';
import { MutationTree, GetterTree, ActionTree } from 'vuex';
import { commonModule } from './modules/common';
import { userModule } from './modules/user-store';
import createPersistedState from 'vuex-persistedstate';
import { MainState, RootState } from '../typings/store';

Vue.use(Vuex);

const mutations: MutationTree<MainState> = {};
const state: MainState = {};

//eslint-disable-next-line
export const getters: GetterTree<MainState, RootState> = {};

export const actions: ActionTree<MainState, RootState> = {};

export default new Vuex.Store<MainState>({
  state,
  mutations,
  getters: {},
  actions: {},
  modules: {
    commonModule,
    userModule,
  },
  plugins: [createPersistedState()],
});
