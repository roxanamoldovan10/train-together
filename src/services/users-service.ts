import firebaseConfig from '@/services/firebase-config';

export default class UsersService {
  public async getCurrentUser(userUid: string) {
    let data: UserObject[] = [];
    await firebaseConfig.usersRef
      .child(userUid)
      .once('value', (snapshot: any) => {
        if (snapshot) {
          data = snapshot.val();
        }
      });
    return data;
  }
  public createUserProfile(userUid: string, userDetails: UserProfileObject) {
    return firebaseConfig.usersRef.child(userUid).set({
      name: userDetails.name,
      username: userDetails.username,
      gender: userDetails.gender,
      location: userDetails.location,
    });
  }

  public updateBulkUserCategories(
    userCategories: [],
    userUid: string,
    categoryUserOptions: {},
    userOptions: {},
  ) {
    const updateObject: any = {};
    userCategories.forEach((key: string) => {
      updateObject[`categories/${key}/users/${userUid}`] = categoryUserOptions;
    });
    updateObject[`users/${userUid}`] = userOptions;

    return firebaseConfig.databaseRef.update(updateObject);
  }

  public addCategoryToUser(userUid: string, categoryId: string) {
    firebaseConfig.usersRef
      .child(userUid + '/categories/' + categoryId)
      .set(true);
  }

  public removeUserFromCategory(userUid: string, categoryId: string) {
    firebaseConfig.usersRef
      .child(userUid + '/categories/' + categoryId)
      .remove();
  }
}

export const usersService = new UsersService();
