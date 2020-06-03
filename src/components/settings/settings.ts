import Vue from 'vue';
import _ from 'lodash';
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
  public categoryUserOptions!: UserProfileObject;
  public selectedOptions: { [key: string]: number } = {};
  public initialSelectedOptions: { [key: string]: number } = {};
  public user = {} as UserObject;
  public userId = '';
  public labelPosition = 'on-border';

  // User store
  @userModule.Getter(userGetters.GetUser)
  public getUser!: UserObject;

  @userModule.Getter(userGetters.GetUserId)
  public getUserId!: string;

  @userModule.Action(userActions.UpdateUserProfile)
  public updateUserProfile!: (payload: object) => Promise<UserObject>;

  // Common store
  @commonModule.Action(CommonActions.UpdateBulkUserCategories)
  public updateBulkUserCategories!: (payload: object) => Promise<UserObject>;

  // Categories store
  @categoriesModule.Action(CategoriesActions.RemoveUserFromCategory)
  public removeUserFromCategory!: (
    payload: object,
  ) => Promise<CategoryObject[]>;

  @categoriesModule.Getter(CategoriesGetters.GetCategories)
  public getCategories!: CategoryObject[];

  // Lifecycle hook
  mounted() {
    this.getUserDetails();
    this.categories = this.getCategories;
  }

  /**
   * Request for current user deatils
   */
  getUserDetails() {
    this.user = this.getUser;
    this.userId = this.getUserId;
    if (this.user.categories) {
      this.selectedOptions = this.user.categories;
      this.initialSelectedOptions = this.selectedOptions;
    }
  }

  /**
   * Updates user profile
   * @returns {Promise}
   */
  async updateProfile() {
    if (!this.user.categories) {
      return this.updateUserProfile({ data: this.user, id: this.getUserId });
    }

    // Checks is user deselected some categories
    const deselectedCategories = Object.keys(
      this.initialSelectedOptions,
    ).filter((obj) => {
      return this.selectedOptions[obj] !== this.initialSelectedOptions[obj];
    });

    this.initialSelectedOptions = this.selectedOptions;

    // Remove categories from user
    if (deselectedCategories) {
      deselectedCategories.forEach((selected: string) => {
        this.removeUserCategory(selected);
      });
    }

    const categoryUserOptions = {
      name: this.user.name,
      username: this.user.username,
      gender: this.user.gender,
      location: this.user.location,
    };

    this.user.categories = this.selectedOptions;

    const options = {
      userCategories: this.selectedOptions,
      categoryUserOptions: categoryUserOptions,
      userOptions: this.user,
      userUid: this.getUserId,
    };

    await this.updateBulkUserCategories(options);
  }

  /**
   * Removes selected category from user
   * Removes user from category
   * @param categoryId
   */
  removeUserCategory(categoryId: string) {
    const categoryIdInt = parseInt(categoryId);
    this.removeUserFromCategory({
      categoryId: categoryIdInt,
      userUid: this.getUserId,
    });

    this.$buefy.toast.open({
      message: 'Category removed',
      position: 'is-top-right',
      type: 'is-danger',
    });
  }
}
