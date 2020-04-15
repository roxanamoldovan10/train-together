import firebaseConfig from '@/services/firebase-config';

export default class CategoriesService {
  public async getAvailableCategories() {
    let data: CategoryObject[] = [];
    await firebaseConfig.categoriesRef.once('value', (snapshot: any) => {
      if (snapshot) {
        data = snapshot.val();
      }
    });
    return data;
  }

  public addUserToCategory(
    categoryId: string,
    userUid: string,
    categoryUserOptions: UserProfileObject,
  ) {
    firebaseConfig.categoriesRef
      .child(categoryId + '/users/' + userUid)
      .set(categoryUserOptions);
  }

  public removeUserFromCategory(categoryId: string, userUid: string) {
    firebaseConfig.categoriesRef
      .child(categoryId + '/users/' + userUid)
      .remove();
  }

  public async getCategoryById(id: string) {
    let data: CategoryObject[] = [];
    await firebaseConfig.categoriesRef
      .child(id)
      .once('value', (snapshot: any) => {
        if (snapshot) {
          data = snapshot.val();
        }
      });
    return data;
  }
}

export const categoriesService = new CategoriesService();
