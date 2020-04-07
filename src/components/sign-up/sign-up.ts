import Vue from "vue";
import { Component } from "vue-property-decorator";
import firebase from "firebase";
import authService from "@/services/auth-service";

@Component({
  template: "./sign-up.html",
  components: {}
})
export default class SignIn extends Vue {
  // Data property
  private database?: any; // Ce type e asta?
  private usersRef?: any;
  public email = "";
  public password = "";
  public name = "";
  public username = "";
  public gender = "";
  public location = "";

  // Lifecycle hook
  mounted() {
    this.database = firebase.database();
    this.usersRef = this.database.ref("users");
  }

  signUp() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.email, this.password)
      .then(result => {
        this.createProfile(result).then(() => {
          authService(this.email, this.password).then(result => {
            this.$router.push({ path: "settings" });
          });
        });
      });
  }

  createProfile(result: any) {
    return this.usersRef.child(result.user.uid).set({
      name: this.name,
      username: this.username,
      gender: this.gender,
      location: this.location
    });
  }
}
