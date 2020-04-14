import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import authService from '@/services/auth-service';

@Component({
  template: './sign-in.html',
  components: {},
})
export default class SignIn extends Vue {
  // Data property
  public email = '';
  public password = '';

  login() {
    authService(this.email, this.password).then((result) => {
      this.$router.push({ path: 'dashboard' });
    });
  }
}
