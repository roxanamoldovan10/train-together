import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import onboardingModal from '../onboarding-modal/onboarding-modal.vue';
import { authActions } from '../../typings/auth';

const authModule = namespace('authModule');

@Component({
  template: './dashboard.html',
  components: { onboardingModal },
})
export default class Dashboard extends Vue {
  @authModule.Action(authActions.Logout)
  public logout!: () => void;

  async userLogout() {
    await this.logout();
    this.$router.replace('login');
  }
}
