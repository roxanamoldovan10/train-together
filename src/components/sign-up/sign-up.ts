import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import firebaseConfig from '@/services/firebase-config';
import usersService from '@/services/users-service';

import { namespace } from 'vuex-class';
import { authActions } from '../../typings/auth';

const authModule = namespace('authModule');

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
  public authentificateUser!: (payload: object) => Promise<Object>;

  signUp() {
    firebaseConfig.auth
      .createUserWithEmailAndPassword(this.email, this.password)
      .then((result) => {
        this.createProfile(result).then(() => {
          const options = { email: this.email, password: this.password };
          this.authentificateUser(options).then(() => {
            // this.$router.push({ path: 'settings' });
          });
        });
      });
  }

  createProfile(result: any) {
    const userDetails = {
      name: this.name,
      username: this.username,
      gender: this.gender,
      location: this.location,
    };
    const usersServiceInstance = new usersService();
    return usersServiceInstance.createUserProfile(result.user.uid, userDetails);
  }
}
