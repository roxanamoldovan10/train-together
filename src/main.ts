import Vue from "vue";
import App from "./App.vue";
import firebase from "firebase";
import router from "./router";
import store from "./store";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "@/scss/main.scss";

Vue.use(Buefy);
Vue.config.productionTip = false;

// TODO maybe move this somwhere more secure?
const firebaseConfig = {
  apiKey: "AIzaSyDtQ4fm9ITbl_6BIwgra5yD_f7EkMQ6Glk",
  authDomain: "train-together-ec92b.firebaseapp.com",
  databaseURL: "https://train-together-ec92b.firebaseio.com",
  projectId: "train-together-ec92b",
  storageBucket: "train-together-ec92b.appspot.com",
  messagingSenderId: "821921239682",
  appId: "1:821921239682:web:35ef2c869a99fc436a5a9b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
