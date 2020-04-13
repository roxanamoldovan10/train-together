import firebase from 'firebase';

export default class CategoriesService {
  public database = firebase.database();
  public categoriesRef = this.database.ref('categories');

  public async getAvailableCategories() {
    this.categoriesRef.on('value', (snapshot: any) => {
      if (snapshot) {
        console.log(snapshot);
        return snapshot.val();
      }
      return {};
    });
  }
}

export const categoriesService = new CategoriesService();
