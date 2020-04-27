import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex';
import { MainState } from '@/typings/store';
import firebaseConfig from '@/services/firebase-config';
import { UserMutations } from '@/typings/user-state';

import { namespace } from 'vuex-class';
const userModule = namespace('userModule');
export class State {
  public userId = '';
  public user = {};
}

//eslint-disable-next-line
const getters: GetterTree<State, any> = {};

const mutations: MutationTree<State> = {};

const actions: ActionTree<State, MainState> = {
  updateBulkUserCategories: (
    { state, commit }: ActionContext<State, MainState>,
    userDetails,
  ) => {
    const updateObject: any = {};
    userDetails.userCategories.forEach((key: string) => {
      updateObject[`categories/${key}/users/${userDetails.userUid}`] =
        userDetails.categoryUserOptions;
    });
    updateObject[`users/${userDetails.userUid}`] = userDetails.userOptions;

    firebaseConfig.databaseRef.update(updateObject).then(() => {
      commit('userModule/setUser', userDetails.userOptions, { root: true });
      // set user details in 'categories'
      // commit('setCategoriesUser', data);
    });
  },
};

export const commonModule = {
  namespaced: true,
  state: (): State => new State(),
  getters,
  mutations,
  actions,
};
