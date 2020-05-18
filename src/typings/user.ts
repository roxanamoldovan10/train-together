export const enum userGetters {
  GetUser = 'getUser',
  GetUserId = 'getUserId',
  GetUserFriendList = 'getUserFriendList',
}

export const enum userMutations {
  SetUser = 'setUser',
  SetUserId = 'setUserId',
  SetUserFriendList = 'setUserFriendList',
}

export const enum userActions {
  CreateUserProfile = 'createUserProfile',
  SetCurrentUser = 'setCurrentUser',
  UpdateUserProfile = 'updateUserProfile',
  AddCategoryToUser = 'addCategoryToUser',
  RemoveCategoryFromUser = 'removeCategoryFromUser',
  AddConnection = 'addConnection',
  AcceptConnection = 'acceptConnection',
}
