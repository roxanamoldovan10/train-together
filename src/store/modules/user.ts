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
  getUserFriendList(state: State) {
    return state.user.friendList;
  },
};

const mutations: MutationTree<State> = {
  setUser: (state: State, payload: UserObject) => {
    state.user = payload;
    if (!state.user.categories) state.user.categories = {};
  },
  setUserId: (state: State, payload: string) => (state.userId = payload),
  setUserCategory: (state: State, payload: Record<string, any>) => {
    state.user.categories[payload.key] = payload.data;
  },
  setUserFriendList: (state: State, payload: Record<string, any>) => {
    state.user.friendList = state.user.friendList ? state.user.friendList : {};
    state.user.friendList[payload.id] = payload.status;
  },
  removeUserCategory: (state: State, payload: any) => {
    delete state.user.categories[payload];
  },
  declineFriendList: (state: State, payload: any) => {
    delete state.user.friendList[payload];
  },
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

  addCategoryToUser: (
    { state, commit }: ActionContext<State, MainState>,
    userDetails,
  ) => {
    const newChildRef = firebase.usersRef
      .child(userDetails.userUid + '/categories')
      .push();
    newChildRef.set(userDetails.categoryId);

    commit('setUserCategory', {
      key: newChildRef.key,
      data: userDetails.categoryId,
    });
  },

  removeCategoryFromUser: (
    { state, commit }: ActionContext<State, MainState>,
    userDetails,
  ) => {
    const userCategoryId = Object.keys(state.user.categories).find(
      (category: string) =>
        state.user.categories[category] === userDetails.categoryId,
    );
    // const index = state.user.categories.indexOf(userDetails.categoryId);
    firebase.usersRef
      .child(userDetails.userUid + '/categories/' + userCategoryId)
      .remove();
    commit('removeUserCategory', userCategoryId);
  },

  // Friend request
  addConnection: (
    { state, commit }: ActionContext<State, MainState>,
    index,
  ) => {
    firebase.usersRef
      .child(state.userId + '/friendList/' + index)
      .set('pending');
    firebase.usersRef
      .child(index + '/friendList/' + state.userId)
      .set('review');

    commit('setUserFriendList', {
      id: index,
      status: 'accepted',
    });
  },

  // Accept Friend request
  acceptConnection: (
    { state, commit }: ActionContext<State, MainState>,
    index,
  ) => {
    firebase.usersRef
      .child(state.userId + '/friendList/' + index)
      .set('accepted');
    firebase.usersRef
      .child(index + '/friendList/' + state.userId)
      .set('accepted');

    commit('declineFriendList', index);
  },

  // Decline Friend request
  declineConnection: (
    { state, commit }: ActionContext<State, MainState>,
    index,
  ) => {
    firebase.usersRef.child(state.userId + '/friendList/' + index).remove();
    firebase.usersRef.child(index + '/friendList/' + state.userId).remove();

    commit('setUserFriendList', {
      id: index,
      status: 'accepted',
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