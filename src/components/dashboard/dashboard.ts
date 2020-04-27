import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import firebaseConfig from '@/services/firebase-config';

@Component({
  template: './dashboard.html',
  components: {},
})
export default class Dashboard extends Vue {
  // Data property
  public myDataProperty?: string;

  logout() {
    firebaseConfig.auth.signOut().then(() => {
      this.$router.replace('login');
    });
  }
}
