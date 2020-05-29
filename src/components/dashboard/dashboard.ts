import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import firebaseConfig from '@/config/firebase-config';
import onboardingModal from '../onboarding-modal/onboarding-modal.vue';

@Component({
  template: './dashboard.html',
  components: { onboardingModal },
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
