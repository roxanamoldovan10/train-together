import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import firebaseConfig from '@/config/firebase-config';

import { namespace } from 'vuex-class';
import { authActions } from '../../typings/auth';
import { userActions } from '../../typings/user';

const authModule = namespace('authModule');
const userModule = namespace('userModule');

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

  @authModule.Action(authActions.AuthentificateUser)
  public authentificateUser!: (payload: object) => Promise<UserObject>;

  @userModule.Action(userActions.CreateUserProfile)
  public createUserProfile!: (payload: object) => Promise<UserObject>;

  signUp() {
    firebaseConfig.auth
      .createUserWithEmailAndPassword(this.email, this.password)
      .then(async (result) => {
        await this.createProfile(result);
        const options = { email: this.email, password: this.password };
        this.authentificateUser(options).then(() => {
          this.$router.push({ path: 'dashboard' });
        });
      });
  }

  async createProfile(result: any) {
    const userDetails = {
      userUid: result.user.uid,
      name: this.name,
      username: this.username,
      gender: this.gender,
      location: this.location,
    };
    await this.createUserProfile(userDetails);
  }
}
