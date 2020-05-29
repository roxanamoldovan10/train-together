import { ActionTree, ActionContext } from 'vuex';
import { MainState } from '@/typings/store';
import firebaseConfig from '@/config/firebase-config';

import { namespace } from 'vuex-class';
export class State {}

const actions: ActionTree<State, MainState> = {
  // Updates user profile detils
  updateBulkUserCategories: (
    { commit }: ActionContext<State, MainState>,
    userDetails,
  ) => {
    const updateObject: any = {};
    Object.keys(userDetails.userCategories).forEach((key: string) => {
      const categoryId = userDetails.userCategories[key];
      // Updates user details in Categories table for each user category
      updateObject[`categories/${categoryId}/users/${userDetails.userUid}`] =
        userDetails.categoryUserOptions;
    });

    // Updates Users table - user details
    updateObject[`users/${userDetails.userUid}`] = userDetails.userOptions;

    firebaseConfig.databaseRef.update(updateObject).then(() => {
      commit('userModule/setUser', userDetails.userOptions, { root: true });
      commit('categoriesModule/setCategoryUser', userDetails, { root: true });
    });
  },
};

export const commonModule = {
  namespaced: true,
  state: (): State => new State(),
  actions,
};
