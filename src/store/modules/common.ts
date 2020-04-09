import { GetterTree, MutationTree } from 'vuex';
export class State {
  public userId = '';
}

//eslint-disable-next-line
const getters: GetterTree<State, any> = {
  getUserId(state: State) {
    return state.userId;
  },
};

const mutations: MutationTree<State> = {
  setCurrentUser: (state: State, payload: string) => (state.userId = payload),
};

export const commonModule = {
  namespaced: true,
  state: (): State => new State(),
  getters,
  mutations,
};
