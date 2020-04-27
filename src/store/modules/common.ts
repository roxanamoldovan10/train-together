import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex';
import { MainState } from '@/typings/store';
import firebaseConfig from '@/config/firebase-config';

import { namespace } from 'vuex-class';
const userModule = namespace('userModule');
export class State {
  public userId = '';
}

const actions: ActionTree<State, MainState> = {
  updateBulkUserCategories: (
    { state, commit }: ActionContext<State, MainState>,
    userDetails,
  ) => {
    const updateObject: any = {};
    Object.keys(userDetails.userCategories).forEach((key: string) => {
      const categoryId = userDetails.userCategories[key];
      updateObject[`categories/${categoryId}/users/${userDetails.userUid}`] =
        userDetails.categoryUserOptions;
    });
    updateObject[`users/${userDetails.userUid}`] = userDetails.userOptions;

    firebaseConfig.databaseRef.update(updateObject).then(() => {
      commit('userModule/setUser', userDetails.userOptions, { root: true });
      // commit('categoriesModule/setCategory', userDetails.userOptions);
    });
  },
};

export const commonModule = {
  namespaced: true,
  state: (): State => new State(),
  actions,
};
