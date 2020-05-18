import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { authActions, authGetters } from '../../typings/auth';
import { userActions, userGetters } from '../../typings/user';

const userModule = namespace('userModule');
const authModule = namespace('authModule');

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

  @userModule.Getter(userGetters.GetUserId)
  public getUserId!: string;

  async login() {
    const options = { email: this.email, password: this.password };
    await this.authentificateUser(options).then(() => {
      try {
        this.setCurrentUser(this.getUserId);
        this.$router.push({ path: 'dashboard' });
      } catch {
        throw Error('Could not fetch data');
      }
    });
  }
}
