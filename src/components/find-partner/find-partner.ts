import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import firebaseConfig from '@/services/firebase-config';
import CategoriesService from '@/services/categories-service';

@Component({
  template: './find-partner.html',
})
export default class FindPartner extends Vue {
  // Data property
  private categoriesService?: any;
  public categories: CategoryObject[] = [];
  public userSelectedFilters: [{}] = [{}];
  public userSelectedCategories: CategoryObject[] = [];

  // Lifecycle hook
  mounted() {
    this.categoriesService = new CategoriesService();
    this.getCategoriesList();
  }

  /**
   * Request for list of categories
   */
  getCategoriesList() {
    this.categoriesService
      .getAvailableCategories()
      .then((result: CategoryObject[]) => {
        this.categories = result;
      });
  }

  updateCategoriesList(index: number) {
    if (this.userSelectedFilters[index] === index) {
      return this.userSelectedFilters.splice(index, 1);
    }
    this.userSelectedFilters.push(index);
  }

  //   !!! Should do request for new selected filters
  updateFilters() {
    this.userSelectedCategories = [];
    this.userSelectedFilters.forEach((id) => {
      this.categoriesService
        .getCategoryById(id)
        .then((result: CategoryObject) => {
          this.userSelectedCategories.push(result);
        });
    });
  }
}
