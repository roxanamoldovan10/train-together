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
  public userSelectedCateg = {};
  public categoryUserOptions!: UserProfileObject;

  public selectedOptions: {}[] = [];
  public updateObject?: any;

  @userModule.Getter(userGetters.GetUser)
  public getUser!: UserObject;

  @userModule.Getter(userGetters.GetUserId)
  public getUserId!: string;

  @userModule.Action(userActions.UpdateUserProfile)
  public updateUserProfile!: (payload: object) => Promise<UserObject>;

  @commonModule.Action(CommonActions.UpdateBulkUserCategories)
  public updateBulkUserCategories!: (payload: object) => Promise<UserObject>;

  @categoriesModule.Action(CategoriesActions.RetriveCategories)
  public retriveCategories!: () => Promise<CategoryObject>;

  @categoriesModule.Getter(CategoriesGetters.GetCategories)
  public getCategories!: CategoryObject[];

  // Lifecycle hook
  mounted() {
    this.getUserDetails();
    this.userSelectedCateg = Object.keys(this.user.categories);
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
    this.user.categories = this.user.categories || [];

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
}
