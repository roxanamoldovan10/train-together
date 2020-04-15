import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import usersService from '@/services/users-service';
import firebaseConfig from '@/services/firebase-config';
import CategoriesService from '@/services/categories-service';

@Component({
  template: './settings.html',
  components: {},
})
export default class Settings extends Vue {
  // Data property
  private categoriesService?: any;
  private usersService?: any;
  public categories: CategoryObject[] = [];
  public userUid = '';
  public user = {} as UserObject;
  public categoryUserOptions!: UserProfileObject;

  public selectedOptions: {}[] = [];
  public updateObject?: any;

  // Lifecycle hook
  mounted() {
    this.categoriesService = new CategoriesService();
    this.usersService = new usersService();
    this.getCategoriesList();
    this.getUserDetails();
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

  /**
   * Request for current user deatils
   */
  getUserDetails() {
    const user = firebaseConfig.auth.currentUser;
    if (user) {
      this.userUid = user.uid;
      this.usersService
        .getCurrentUser(this.userUid)
        .then((result: UserObject) => {
          if (result) {
            this.user = result;
            this.categoryUserOptions = {
              name: this.user.name,
              username: this.user.username,
              gender: this.user.gender,
              location: this.user.location,
            };
            if (this.user.categories) {
              this.getUserSelectedCategories();
            }
          }
        });
    }
  }

  /**
   * Assign keys for user selected categories
   */
  getUserSelectedCategories() {
    const userCategoriesKeys = Object.keys(this.user.categories).map(Number);
    userCategoriesKeys.forEach((categoryKey: number) => {
      this.selectedOptions.push(categoryKey);
    });
  }

  /**
   * Updates user profile
   * @returns {Promise}
   */
  updateProfile({ username, name, gender, location }: any) {
    this.user.categories = this.user.categories || [];

    this.categoryUserOptions = {
      name: this.user.name,
      username: this.user.username,
      gender: this.user.gender,
      location: this.user.location,
    };

    const userOptions = {
      name: name,
      username: username,
      gender: gender,
      location: location,
      categories: this.user.categories,
    };

    // Bulk update user and categories db objects
    if (this.user.categories) {
      const userCategories = Object.keys(this.user.categories);
      this.usersService.updateBulkUserCategories(
        userCategories,
        this.userUid,
        this.categoryUserOptions,
        userOptions,
      );
    }
  }

  /**
   * Add/Remove user category
   */
  updateUserCategories(index: string) {
    const categoryId = parseInt(index);
    const isSelected = this.selectedOptions.some((selected) => {
      if (typeof selected === 'string') selected = parseInt(selected);
      return selected === categoryId;
    });

    if (isSelected) {
      return this.addUserCategory(categoryId);
    }
    return this.removeUserCategory(categoryId);
  }

  /**
   * Add selected category to user
   * Add user to category
   * @param categoryId
   */
  addUserCategory(categoryId: number) {
    this.usersService.addCategoryToUser(this.userUid, categoryId);
    this.categoriesService.addUserToCategory(
      categoryId,
      this.userUid,
      this.categoryUserOptions,
    );
    if (categoryId != null) {
      this.user.categories[categoryId] = true;
      this.$buefy.toast.open({
        message: 'Category updated',
        position: 'is-top-right',
        type: 'is-success',
      });
    }
  }

  /**
   * Removes selected category from user
   * Removes user from category
   * @param categoryId
   */
  removeUserCategory(categoryId: number) {
    this.usersService.removeUserFromCategory(this.userUid, categoryId);
    this.categoriesService.removeUserFromCategory(categoryId, this.userUid);
    this.$buefy.toast.open({
      message: 'Category removed',
      position: 'is-top-right',
      type: 'is-danger',
    });
  }
}
