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
}

export const categoriesService = new CategoriesService();
