import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { authGetters, authActions } from '../../typings/auth';

const authModule = namespace('authModule');

@Component({
  template: './sign-in.html',
  components: {},
})
export default class SignIn extends Vue {
  @authModule.Getter(authGetters.GetUserAuthState)
  public getUserAuthState!: boolean;

  @authModule.Action(authActions.Logout)
  public logout!: () => void;

  public get isUserAuthentificated(): boolean {
    return this.getUserAuthState;
  }

  async userLogout() {
    await this.logout();
    this.$router.replace('login');
  }
}
