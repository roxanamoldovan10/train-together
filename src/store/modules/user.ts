import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex';
import { MainState } from '@/typings/store';
import firebase from '@/services/firebase-config';
export class State {
  public user: UserObject = {} as UserObject;
  public userId = '';
}

//eslint-disable-next-line
const getters: GetterTree<State, any> = {
  getUser(state: State) {
    return state.user;
  },
};

const mutations: MutationTree<State> = {
  setUser: (state: State, payload: UserObject) => (state.user = payload),
  setUserId: (state: State, payload: string) => (state.userId = payload),
};

const actions: ActionTree<State, MainState> = {
  // Authentification
  async createUserProfile(
    { state, commit }: ActionContext<State, MainState>,
    userDetails,
  ) {
    try {
      firebase.usersRef.child(userDetails.userUid).set({
        name: userDetails.name,
        username: userDetails.username,
        gender: userDetails.gender,
        location: userDetails.location,
      });
      const userProfile = {
        name: userDetails.name,
        username: userDetails.username,
        gender: userDetails.gender,
        location: userDetails.location,
      };
      commit('setUser', userProfile);
      commit('setUserId', userDetails.userUid);
    } catch {
      throw Error('Could not fetch data');
    }
  },

  getCurrentUser({ state, commit }: ActionContext<State, MainState>, userId) {
    let data: UserObject[] = [];
    firebase.usersRef.child(userId).once('value', (snapshot: any) => {
      if (snapshot) {
        data = snapshot.val();
      }
    });
    commit('setUser', data);
  },
};

export const userModule = {
  namespaced: true,
  state: (): State => new State(),
  getters,
  mutations,
  actions,
};
