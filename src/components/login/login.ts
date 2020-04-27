import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { authActions, authGetters } from '../../typings/auth';

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

  async login() {
    const options = { email: this.email, password: this.password };
    await this.authentificateUser(options).then(() => {
      try {
        this.$router.push({ path: 'dashboard' });
      } catch {
        throw Error('Could not fetch data');
      }
    });
  }
}
