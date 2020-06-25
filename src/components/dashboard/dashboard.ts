import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import onboardingModal from '../onboarding-modal/onboarding-modal.vue';

@Component({
  template: './dashboard.html',
  components: { onboardingModal },
})
export default class Dashboard extends Vue {}
