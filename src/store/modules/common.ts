import { GetterTree, MutationTree } from 'vuex';
export class State {
  public userId = '';
}

export const commonModule = {
  namespaced: true,
  state: (): State => new State(),
};
