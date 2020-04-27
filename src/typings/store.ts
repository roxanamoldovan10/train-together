export interface State {
  userId: string;
}

export interface RootState {
  version: string;
}

export interface MainState {
  generalId?: string;
  user?: UserObject;
}
