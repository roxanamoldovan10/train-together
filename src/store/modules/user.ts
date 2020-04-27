import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex';
import { MainState } from '@/typings/store';
import firebase from '@/config/firebase-config';
export class State {
  public user: UserObject = {} as UserObject;
  public userId = '';
}

//eslint-disable-next-line
const getters: GetterTree<State, any> = {
  getUser(state: State) {
    return state.user;
  },
  getUserId(state: State) {
    return state.userId;
  },
};

const mutations: MutationTree<State> = {
  setUser: (state: State, payload: UserObject) => (state.user = payload),
  setUserId: (state: State, payload: string) => (state.userId = payload),
};

const actions: ActionTree<State, MainState> = {
  // Authentification | Sets users profile data + id
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

  // Current user profile data
  setCurrentUser({ state, commit }: ActionContext<State, MainState>, userId) {
    firebase.usersRef.child(userId).once('value', (snapshot: any) => {
      if (snapshot) {
        commit('setUser', snapshot.val());
      }
    });
  },

  updateUserProfile({ state, commit }: ActionContext<State, MainState>, user) {
    const updateObject: any = {};
    updateObject[`users/${user.id}`] = user.data;
    firebase.databaseRef.update(updateObject).then(() => {
      commit('setUser', user.data);
    });
  },
};

export const userModule = {
  namespaced: true,
  state: (): State => new State(),
  getters,
  mutations,
  actions,
};
