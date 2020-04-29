import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { userGetters, userActions } from '../../typings/user';
import { CommonActions } from '../../typings/common';
import { CategoriesActions, CategoriesGetters } from '../../typings/categories';

const userModule = namespace('userModule');
const commonModule = namespace('commonModule');
const categoriesModule = namespace('categoriesModule');

@Component({
  template: './settings.html',
  components: {},
})
export default class Settings extends Vue {
  // Data property
  public categories: CategoryObject[] = [];
  public userId = '';
  public user = {} as UserObject;
  public categoryUserOptions!: UserProfileObject;

  public selectedOptions: {}[] = [];
  public updateObject?: any;

  // User store
  @userModule.Getter(userGetters.GetUser)
  public getUser!: UserObject;

  @userModule.Getter(userGetters.GetUserId)
  public getUserId!: string;

  @userModule.Action(userActions.UpdateUserProfile)
  public updateUserProfile!: (payload: object) => Promise<UserObject>;

  @userModule.Action(userActions.AddCategoryToUser)
  public addCategoryToUser!: (payload: object) => Promise<UserObject>;

  @userModule.Action(userActions.RemoveCategoryFromUser)
  public removeCategoryFromUser!: (payload: object) => Promise<UserObject>;

  // Common store
  @commonModule.Action(CommonActions.UpdateBulkUserCategories)
  public updateBulkUserCategories!: (payload: object) => Promise<UserObject>;

  // Categories store
  @categoriesModule.Action(CategoriesActions.RetriveCategories)
  public retriveCategories!: () => Promise<CategoryObject[]>;

  @categoriesModule.Action(CategoriesActions.AddUserToCategory)
  public addUserToCategory!: (payload: object) => Promise<CategoryObject[]>;

  @categoriesModule.Action(CategoriesActions.RemoveUserFromCategory)
  public removeUserFromCategory!: (
    payload: object,
  ) => Promise<CategoryObject[]>;

  @categoriesModule.Getter(CategoriesGetters.GetCategories)
  public getCategories!: CategoryObject[];

  // Lifecycle hook
  mounted() {
    this.getUserDetails();
    this.retriveCategories();
    this.categories = this.getCategories;
  }

  /**
   * Request for list of categories
   */
  //   getCategoriesList() {}

  /**
   * Request for current user deatils
   */
  getUserDetails() {
    this.user = this.getUser;
    this.userId = this.getUserId;
    // this.user.categories = this.user.categories || [];
    if (this.user.categories) this.getUserSelectedCategories();

    // this.categoryUserOptions = {
    //   name: this.user.name,
    //   username: this.user.username,
    //   gender: this.user.gender,
    //   location: this.user.location,
    // };
  }

  /**
   * Updates user profile
   * @returns {Promise}
   */
  updateProfile({ username, name, gender, location }: any) {
    if (!this.user.categories) {
      return this.updateUserProfile({ data: this.user, id: this.getUserId });
    }

    const categoryUserOptions = {
      name: this.user.name,
      username: this.user.username,
      gender: this.user.gender,
      location: this.user.location,
    };

    const options = {
      userCategories: this.user.categories,
      categoryUserOptions: categoryUserOptions,
      userOptions: this.user,
      userUid: this.getUserId,
    };

    this.updateBulkUserCategories(options);
  }

  /**
   * Assign keys for user selected categories
   */
  getUserSelectedCategories() {
    const userCategoriesKeys = Object.keys(this.user.categories);
    userCategoriesKeys.forEach((categoryKey: string) => {
      this.selectedOptions.push(this.user.categories[categoryKey]);
    });
    console.log('selected: ', this.selectedOptions);
  }

  /**
   * Add/Remove user category
   */
  updateUserCategories(categoryId: number) {
    const userInitialCategories: any = [];
    if (this.user.categories) {
      Object.keys(this.user.categories).forEach((categoryKey: string) => {
        userInitialCategories.push(this.user.categories[categoryKey]);
      });
    }

    const userHasCategory = userInitialCategories.some(
      (option: number) => option === categoryId,
    );
    if (!this.getUser.categories || !userHasCategory) {
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
    this.addCategoryToUser({ userUid: this.getUserId, categoryId: categoryId });
    console.log(this.getUser);

    const categoryUserOptions = {
      name: this.user.name,
      username: this.user.username,
      gender: this.user.gender,
      location: this.user.location,
    };
    this.addUserToCategory({
      categoryId: categoryId,
      userUid: this.getUserId,
      categoryUserOptions: categoryUserOptions,
    });

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
    this.removeCategoryFromUser({
      userUid: this.getUserId,
      categoryId: categoryId,
    });
    this.removeUserFromCategory({
      categoryId: categoryId,
      userUid: this.getUserId,
    });

    this.$buefy.toast.open({
      message: 'Category removed',
      position: 'is-top-right',
      type: 'is-danger',
    });
  }
}
