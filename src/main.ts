import Vue from 'vue';
import App from './App.vue';
import firebase from 'firebase';
import router from './router';
import store from './store';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import '@/scss/main.scss';
import _ from 'lodash';
import firebaseService from '@/services/firebase-service';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserSecret);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(Buefy);
Vue.config.productionTip = false;

let app = {};

// Initialize Firebase
firebase.initializeApp(firebaseService());

firebase.auth().onAuthStateChanged(() => {
  if (_.isEmpty(app)) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app');
  }
});
