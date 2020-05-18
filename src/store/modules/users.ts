import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex';
import { MainState } from '@/typings/store';
import firebase from '@/config/firebase-config';
export class State {
  public users: { [key: string]: any } = {};
  public pendingConnections: [] = [];
  public acceptedConnections: [] = [];
}

//eslint-disable-next-line
const getters: GetterTree<State, any> = {
  getUsers(state: State) {
    return state.users;
  },
  getPendingUsers(state: State) {
    return state.pendingConnections;
  },
  getAcceptedUsers(state: State) {
    return state.acceptedConnections;
  },
};

const mutations: MutationTree<State> = {
  setUsers: (state: State, payload: { [key: string]: any[] }) => {
    state.users = payload;
  },
  setUserPending: (state: State, payload: []) => {
    state.pendingConnections = payload;
  },
  setUserAccepted: (state: State, payload: []) => {
    state.acceptedConnections = payload;
  },
  //   updateUSerConnections(state: State, payload: []) => {

  //   }
};

const actions: ActionTree<State, MainState> = {
  // Authentification | Sets users profile data + id
  async userList(
    { state, commit }: ActionContext<State, MainState>,
    userDetails,
  ) {
    try {
      firebase.usersRef.once('value', (snapshot: any) => {
        if (snapshot) {
          commit('setUsers', snapshot.val());
        }
      });
    } catch {
      throw Error('Could not fetch data');
    }
  },

  async userConnections(
    { state, commit }: ActionContext<State, MainState>,
    userDetails,
  ) {
    const pending: { [key: string]: string } = {};
    const accepted: { [key: string]: string } = {};
    const userPendingConnections = Object.keys(userDetails.friendList).filter(
      (connection: string) => userDetails.friendList[connection] === 'pending',
    );
    const userAcceptedConnections = Object.keys(userDetails.friendList).filter(
      (connection: string) => userDetails.friendList[connection] === 'accepted',
    );
    await userPendingConnections.forEach((pendingUser: string) => {
      if (!state.users[pendingUser]) return;

      // !!!!!!!!!!!!!!!!!

      pending[pendingUser] = state.users[pendingUser].name;
    });

    await userAcceptedConnections.forEach((acceptedUser: string) => {
      if (!state.users[acceptedUser]) return;
      accepted[acceptedUser] = state.users[acceptedUser].name;
    });

    commit('setUserPending', pending);
    commit('setUserAccepted', accepted);
  },
};

export const usersModule = {
  namespaced: true,
  state: (): State => new State(),
  getters,
  mutations,
  actions,
};
