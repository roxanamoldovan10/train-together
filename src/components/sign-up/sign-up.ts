import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import firebaseConfig from '@/config/firebase-config';

import { namespace } from 'vuex-class';
import { authActions } from '../../typings/auth';
import { userGetters, userActions } from '../../typings/user';
import { CategoriesGetters, CategoriesActions } from '../../typings/categories';

const authModule = namespace('authModule');
const userModule = namespace('userModule');
const categoriesModule = namespace('categoriesModule');

@Component({
  template: './sign-up.html',
})
export default class SignIn extends Vue {
  public email = '';
  public password = '';
  public name = '';
  public username = '';
  public gender = '';
  public location = '';
  public isCardModalActive = false;
  public categories: CategoryObject[] = [];
  public selectedCategories: [] = [];

  @authModule.Action(authActions.AuthentificateUser)
  public authentificateUser!: (payload: object) => Promise<UserObject>;

  @userModule.Action(userActions.CreateUserProfile)
  public createUserProfile!: (payload: object) => Promise<UserObject>;

  @userModule.Getter(userGetters.GetUserId)
  public getUserId!: string;

  @categoriesModule.Getter(CategoriesGetters.GetCategories)
  public getCategories!: CategoryObject[];

  @userModule.Action(userActions.AddCategoryToUser)
  public addCategoryToUser!: (payload: object) => Promise<UserObject>;

  @categoriesModule.Action(CategoriesActions.AddUserToCategory)
  public addUserToCategory!: (payload: object) => Promise<CategoryObject[]>;

  mounted() {
    this.categories = this.getCategories;
  }
  signUp() {
    firebaseConfig.auth
      .createUserWithEmailAndPassword(this.email, this.password)
      .then(async (result) => {
        await this.createProfile(result);
        const options = { email: this.email, password: this.password };
        this.authentificateUser(options).then(() => {
          this.$router.push({ path: 'dashboard' });
        });
        this.isCardModalActive = true;
      });
  }

  createProfile(result: any) {
    const userDetails = {
      userUid: result.user.uid,
      name: this.name,
      username: this.username,
      gender: this.gender,
      location: this.location,
    };
    this.createUserProfile(userDetails);
  }

  addCategories() {
    const userId = this.getUserId;
    this.selectedCategories.forEach((selected: number) => {
      this.addUserCategory(selected, userId);
    });
  }

  /**
   * Add selected category to user
   * Add user to category
   * @param categoryId
   */
  addUserCategory(categoryId: number, userId: string) {
    this.addCategoryToUser({ userUid: userId, categoryId: categoryId });

    const categoryUserOptions = {
      name: this.name,
      username: this.username,
      gender: this.gender,
      location: this.location,
    };
    this.addUserToCategory({
      categoryId: categoryId,
      userUid: userId,
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

  isInvalid() {
    return !this.email || !this.password || !this.name || !this.username;
  }

  hasError() {
    return this.password.length < 8;
  }
}
