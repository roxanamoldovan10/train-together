import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { authGetters } from '../../typings/auth';

const authModule = namespace('authModule');

@Component({
  template: './sign-in.html',
  components: {},
})
export default class SignIn extends Vue {
  @authModule.Getter(authGetters.GetUserAuthState)
  public getUserAuthState!: boolean;

  public get isUserAuthentificated() {
    return this.getUserAuthState;
  }
}
