import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex';
import { MainState } from '@/typings/store';
import firebase from '@/config/firebase-config';
export class State {
  public isAuthentificated = false;
}

//eslint-disable-next-line
const getters: GetterTree<State, any> = {
  getUserAuthState(state: State) {
    return state.isAuthentificated;
  },
};

const mutations: MutationTree<State> = {
  setUserAuthState: (state: State, payload: boolean) =>
    (state.isAuthentificated = payload),
};

const actions: ActionTree<State, MainState> = {
  // Authentification
  async authentificateUser(
    { commit }: ActionContext<State, MainState>,
    userCredentials,
  ) {
    try {
      await firebase.auth
        .signInWithEmailAndPassword(
          userCredentials.email,
          userCredentials.password,
        )
        .then((result) => {
          if (!result || !result.user) return;
          commit('userModule/setUserId', result.user.uid, { root: true });
        });
      commit('setUserAuthState', true);
    } catch {
      throw Error('Could not fetch data');
    }
  },
  logout({ commit }: ActionContext<State, MainState>) {
    firebase.auth.signOut();
    commit('setUserAuthState', false);
  },
};

export const authModule = {
  namespaced: true,
  state: (): State => new State(),
  getters,
  mutations,
  actions,
};
