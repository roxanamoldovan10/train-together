import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex';
import { MainState } from '@/typings/store';
import firebase from '@/config/firebase-config';
export class State {
  public categories: CategoryObject[] = [];
}

//eslint-disable-next-line
const getters: GetterTree<State, any> = {
  getCategories(state: State) {
    return state.categories;
  },
};

const mutations: MutationTree<State> = {
  setCategories: (state: State, payload: CategoryObject[]) =>
    (state.categories = payload),
  setCategoryUser: (state: State, payload) => {
    Object.keys(payload.userCategories).forEach((key: string) => {
      const categoryId: number = payload.userCategories[key];

      if (!state.categories[categoryId].users) {
        state.categories[categoryId].users = [];
      }
      state.categories[categoryId].users[payload.userUid] =
        payload.categoryUserOptions;
    });
  },
  setNewUserCategory: (state: State, payload) => {
    if (state.categories[payload.categoryId].users) {
      return (state.categories[payload.categoryId].users[payload.userUid] =
        payload.categoryUserOptions);
    }

    state.categories[payload.categoryId].users = [];
    state.categories[payload.categoryId].users[payload.userUid] =
      payload.categoryUserOptions;
  },
};

const actions: ActionTree<State, MainState> = {
  retriveCategories({ commit }: ActionContext<State, MainState>) {
    try {
      firebase.categoriesRef.once('value', (snapshot: any) => {
        if (snapshot) {
          commit('setCategories', snapshot.val());
        }
      });
    } catch {
      throw Error('Could not fetch data');
    }
  },

  addUserToCategory({ commit }: ActionContext<State, MainState>, options) {
    try {
      firebase.categoriesRef
        .child(options.categoryId + '/users/' + options.userUid)
        .set(options.categoryUserOptions);
      const mutationOptions = {
        categoryId: options.categoryId,
        userUid: options.userUid,
        categoryUserOptions: options.categoryUserOptions,
      };
      commit('setNewUserCategory', mutationOptions);
    } catch {
      throw Error('Could not fetch data');
    }
  },

  removeUserFromCategory({ commit }: ActionContext<State, MainState>, options) {
    firebase.categoriesRef
      .child(options.categoryId + '/users/' + options.userUid)
      .remove();
  },
};

export const categoriesModule = {
  namespaced: true,
  state: (): State => new State(),
  getters,
  mutations,
  actions,
};
