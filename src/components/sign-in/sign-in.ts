import Vue from "vue";
import { Component } from "vue-property-decorator";
import firebase from "firebase";

@Component({
  template: "./sign-in.html",
  components: {}
})
export default class SignIn extends Vue {
  // Data property
  private database?: any; // Ce type e asta?
  private usersRef?: any;
  private categoriesRef?: any;
  public email = "";
  public password = "";
  public name = "";
  public username = "";
  public gender = "";
  public location = "";
  public showLogin = true;

  // Lifecycle hook
  mounted() {
    this.database = firebase.database();
    this.usersRef = this.database.ref("users");
    this.categoriesRef = this.database.ref("categories");
  }

  signUp() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.email, this.password)
      .then(() => {
        this.createProfile().then(() => {
          this.login();
        });
      });
  }

  createProfile() {
    return this.usersRef.set({
      name: this.name,
      username: this.username,
      gender: this.gender,
      location: this.location
    });
  }

  login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.email, this.password)
      .then(result => {
        this.$router.push({ path: "dashboard" });
      });
  }
}
