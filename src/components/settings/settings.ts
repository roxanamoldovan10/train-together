import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import categoriesService from '@/services/categories-service';
import usersService from '@/services/users-service';
import { namespace } from 'vuex-class';
import firebaseConfig from '@/services/firebase-config';
import CategoriesService from '@/services/categories-service';
import { UserGetters, UserActions } from '../../typings/user-state';
import { CommonActions } from '../../typings/common';

const userModule = namespace('userModule');
const commonModule = namespace('commonModule');

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
  public userSelectedCateg = {};
  public categoryUserOptions!: UserProfileObject;

  public selectedOptions: {}[] = [];
  public updateObject?: any;

  @userModule.Getter(UserGetters.GetUser)
  public getUser!: UserObject;

  @userModule.Getter(UserGetters.CurrentUserId)
  public getCurrentUserId!: string;

  @commonModule.Action(CommonActions.UpdateBulkUserCategories)
  public updateBulkUserCategories!: (payload: object) => Promise<UserObject>;

  @userModule.Action(UserActions.AddCategoryToUser)
  public addCategoryToUser!: (payload: object) => Promise<UserObject>;

  @userModule.Action(UserActions.RemoveUserFromCategory)
  public removeUserFromCategory!: (payload: object) => Promise<UserObject>;
  // Lifecycle hook
  mounted() {
    this.categoriesService = new CategoriesService();
    this.usersService = new usersService();
    this.getCategoriesList();
    this.getUserDetails();
    this.userSelectedCateg = Object.keys(this.user.categories);
  }

  /**
   * Request for list of categories
   */
  getCategoriesList() {
    new categoriesService().getAvailableCategories().then((result) => {
      this.categories = result;
    });
  }

  /**
   * Request for current user deatils
   */
  getUserDetails() {
    this.user = this.getUser;
    this.userUid = this.getCurrentUserId;
    this.user.categories = this.user.categories || [];
    if (this.user.categories) {
      this.getUserSelectedCategories();
      console.log('USER CATEGORIES:: ', this.user.categories);
    }

    this.categoryUserOptions = {
      name: this.user.name,
      username: this.user.username,
      gender: this.user.gender,
      location: this.user.location,
    };
  }

  /**
   * Assign keys for user selected categories
   */
  getUserSelectedCategories() {
    //   const userCategoriesKeys = Object.keys(this.user.categories).map(Number);
    //   userCategoriesKeys.forEach((categoryKey: number) => {
    //     this.selectedOptions.push(categoryKey);
    //   });
    // this.userSelectedCateg = Object.keys(this.user.categories).filter(
    //   (categ: string) => {
    //     const categKey = parseInt(categ);
    //     this.user.categories[categKey] !== null;
    //   },
    // );
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
      const userDetails = {
        userCategories: userCategories,
        userUid: this.userUid,
        categoryUserOptions: this.categoryUserOptions,
        userOptions: userOptions,
      };
      this.updateBulkUserCategories(userDetails);
    }
  }

  /**
   * Add/Remove user category
   */
  updateUserCategories(index: string) {
    const categoryId = parseInt(index);

    if (!this.getUser.categories || !this.getUser.categories[categoryId]) {
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
    this.addCategoryToUser({ userUid: this.userUid, categoryId: categoryId });
    console.log(this.getUser);

    this.categoriesService.addUserToCategory(
      categoryId,
      this.userUid,
      this.categoryUserOptions,
    );
    if (categoryId != null) {
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
    this.removeUserFromCategory({
      userUid: this.userUid,
      categoryId: categoryId,
    });
    this.categoriesService.removeUserFromCategory(categoryId, this.userUid);
    this.$buefy.toast.open({
      message: 'Category removed',
      position: 'is-top-right',
      type: 'is-danger',
    });
  }
}
