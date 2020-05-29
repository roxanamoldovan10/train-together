import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import firebaseConfig from '@/config/firebase-config';

import { namespace } from 'vuex-class';
import { userActions } from '../../typings/user';

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

  @userModule.Action(userActions.CreateUserProfile)
  public createUserProfile!: (payload: object) => Promise<UserObject>;

  async signUp() {
    await firebaseConfig.auth
      .createUserWithEmailAndPassword(this.email, this.password)
      .then((result) => {
        this.createProfile(result);
        return this.$router.push({ path: 'login' });
      });
  }

  createProfile(result: any) {
    const userDetails = {
      userUid: result.user.uid,
      name: this.name,
      username: this.username,
      gender: this.gender,
    };
    this.createUserProfile(userDetails);
  }

  isInvalid() {
    return !this.email || !this.password || !this.name || !this.username;
  }

  hasError() {
    return this.password.length < 8;
  }
}
