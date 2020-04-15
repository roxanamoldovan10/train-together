import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import authService from '@/services/auth-service';
import firebaseConfig from '@/services/firebase-config';
import usersService from '@/services/users-service';

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

  signUp() {
    firebaseConfig.auth
      .createUserWithEmailAndPassword(this.email, this.password)
      .then((result) => {
        this.createProfile(result).then(() => {
          authService(this.email, this.password).then(() => {
            this.$router.push({ path: 'settings' });
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
