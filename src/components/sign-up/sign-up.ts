import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import authService from '@/services/auth-service';
import firebaseConfig from '@/services/firebase-config';
import { namespace } from 'vuex-class';
import { UserActions } from '../../typings/user-state';

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

  @userModule.Action(UserActions.CreateUserProfile)
  public createUserProfile!: (payload: object) => Promise<UserObject>;

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
      uid: result.user.uid,
      name: this.name,
      username: this.username,
      gender: this.gender,
      location: this.location,
    };
    return this.createUserProfile(userDetails);
  }
}
