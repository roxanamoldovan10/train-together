import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { authActions, authGetters } from '../../typings/auth';
import { userActions, userGetters } from '../../typings/user';
import { CategoriesActions } from '../../typings/categories';

const userModule = namespace('userModule');
const authModule = namespace('authModule');
const categoriesModule = namespace('categoriesModule');

@Component({
  template: './sign-in.html',
  components: {},
})
export default class SignIn extends Vue {
  // Data property
  public email = '';
  public password = '';

  @authModule.Getter(authGetters.GetUserAuthState)
  public getUserAuthState!: boolean;

  @authModule.Action(authActions.AuthentificateUser)
  public authentificateUser!: (payload: object) => Promise<UserObject>;

  @userModule.Action(userActions.SetCurrentUser)
  public setCurrentUser!: (payload: string) => Promise<UserObject>;

  @userModule.Action(userActions.SetCurrentUserId)
  public setCurrentUserId!: () => Promise<UserObject>;

  @userModule.Getter(userGetters.GetUserId)
  public getUserId!: string;

  // Categories store
  @categoriesModule.Action(CategoriesActions.RetriveCategories)
  public retriveCategories!: () => Promise<CategoryObject[]>;

  async login() {
    const options = { email: this.email, password: this.password };
    await this.authentificateUser(options).then(() => {
      try {
        this.setCurrentUserId();
        this.setCurrentUser(this.getUserId);
        this.retriveCategories();
        this.$router.push({ path: 'dashboard' });
      } catch {
        throw Error('Could not fetch data');
      }
    });
  }
}
