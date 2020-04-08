import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import firebase from 'firebase';
import authService from '@/services/auth-service';

@Component({
  template: './sign-in.html',
  components: {},
})
export default class SignIn extends Vue {
  // Data property
  private database?: any; // Ce type e asta?
  private usersRef?: any;
  public email = '';
  public password = '';

  // Lifecycle hook
  mounted() {
    this.database = firebase.database();
    this.usersRef = this.database.ref('users');
  }

  login() {
    authService(this.email, this.password).then((result) => {
      this.$router.push({ path: 'dashboard' });
    });
  }
}
