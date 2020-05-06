import Vue from 'vue';
import App from './App.vue';
import firebaseConfig from '@/config/firebase-config';
import router from './router';
import store from './store';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import '@/scss/main.scss';
import _ from 'lodash';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCog,
  faHome,
  faTag,
  faSlidersH,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCog, faHome, faTag, faSlidersH);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(Buefy);
Vue.config.productionTip = false;

let app = {};

firebaseConfig.auth.onAuthStateChanged(() => {
  if (_.isEmpty(app)) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app');
  }
});
