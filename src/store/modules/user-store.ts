import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex';
import { MainState } from '@/typings/store';
import firebaseConfig from '@/services/firebase-config';
import _ from 'lodash';
export class State {
  public userId = '';
  public user: UserObject = {} as UserObject;
}

const getters: GetterTree<State, any> = {
  getCurrentUserId(state: State) {
    return state.userId;
  },
  getUser(state: State) {
    return state.user;
  },
};

const mutations: MutationTree<State> = {
  setCurrentUserId: (state: State, payload: string) => (state.userId = payload),
  setUser: (state: State, payload: UserObject) => (state.user = payload),
  addUserCategory: (state: State, payload: number) =>
    state.user.categories.push(payload),
  removeUserCategory: (state: State, payload: number) => {
    const index = state.user.categories.indexOf(payload);
    state.user.categories.splice(index, 1);
  },
};

const actions: ActionTree<State, MainState> = {
  currentUser: (
    { state, commit }: ActionContext<State, MainState>,
    userUid: string,
  ) => {
    // if (!_.isEmpty(state.user)) {
    //   return;
    // }
    try {
      let data: UserObject[] = [];
      firebaseConfig.usersRef.child(userUid).once('value', (snapshot: any) => {
        if (snapshot) {
          data = snapshot.val();
          commit('setUser', data);
          commit('setCurrentUserId', userUid);
        }
      });
      return data;
    } catch {
      throw Error('Could not fetch user');
    }
  },

  createUserProfile: (
    { state, commit }: ActionContext<State, MainState>,
    userDetails,
  ) => {
    firebaseConfig.usersRef.child(userDetails.uid).set({
      name: userDetails.name,
      username: userDetails.username,
      gender: userDetails.gender,
      location: userDetails.location,
    });
    commit('setUser', userDetails);
  },

  addCategoryToUser: (
    { state, commit }: ActionContext<State, MainState>,
    userDetails,
  ) => {
    const newChildRef = firebaseConfig.usersRef
      .child(userDetails.userUid + '/categories')
      .push();
    newChildRef.set(userDetails.categoryId);

    commit('addUserCategory', newChildRef, userDetails.categoryId);
  },

  removeUserFromCategory: (
    { state, commit }: ActionContext<State, MainState>,
    userDetails,
  ) => {
    const index = state.user.categories.indexOf(userDetails.categoryId);
    firebaseConfig.usersRef
      .child(userDetails.userUid + '/categories/' + index)
      .remove();
    commit('removeUserCategory', userDetails.categoryId);
  },
};

export const userModule = {
  namespaced: true,
  state: (): State => new State(),
  getters,
  mutations,
  actions,
};
