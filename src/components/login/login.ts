import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import authService from '@/services/auth-service';
import { namespace } from 'vuex-class';
import { UserActions } from '../../typings/user-state';

const userModule = namespace('userModule');

@Component({
  template: './sign-in.html',
  components: {},
})
export default class SignIn extends Vue {
  // Data property
  public email = '';
  public password = '';

  @userModule.Action(UserActions.CurrentUser)
  public currentUser!: (payload: string) => Promise<UserObject>;

  login() {
    authService(this.email, this.password).then((result) => {
      if (!result || !result.user) return;
      const userUid = result.user.uid;
      this.currentUser(userUid);

      this.$router.push({ path: 'dashboard' });
    });
  }
}
