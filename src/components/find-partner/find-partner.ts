import Vue from "vue";
import { Component } from "vue-property-decorator";
import firebase from "firebase";

@Component({
  template: "find-partner.html",
  components: {}
})
export default class FindPartner extends Vue {
  private database?: any;
  private categoriesRef?: any;
  private usersRef?: any;
  public user: userObject = {};
  public categories: categoryObject[] = [];
  public selectedCaterogies: {}[] = [];
  public userUid = "";
  // Lifecycle hook
  mounted() {
    this.database = firebase.database();
    this.categoriesRef = this.database.ref("categories");
    this.usersRef = this.database.ref("users");
    this.getUserDetails();
    this.getCategoriesList();
    console.log(this.categories);
  }

  /**
   * Request for current user deatils
   */
  getUserDetails() {
    const user = firebase.auth().currentUser;
    if (user) {
      this.userUid = user.uid;
      this.usersRef.child(user.uid).once("value", (snapshot: any) => {
        if (snapshot) {
          this.user = snapshot.val();
          this.getUsersCategories();
        }
      });
    }
  }

  /**
   * Request for list of categories
   */
  getCategoriesList() {
    this.categoriesRef.on("value", (snapshot: any) => {
      if (snapshot) {
        this.categories = { ...snapshot.val() };
      }
    });
  }

  getUsersCategories() {
    const userCategoriesKeys = Object.keys(this.user.categories).map(Number);
    userCategoriesKeys.forEach(key => {
      if (
        this.categories[key] !== undefined &&
        this.categories[key].type !== undefined
      ) {
        this.selectedCaterogies[key] = {
          id: key,
          active: true,
          name: this.categories[key].type
        };
        console.log("baba", this.selectedCaterogies);
      }
    });
  }

  removeSelectedCategory(index: number) {
    this.selectedCaterogies.splice(index, 1);
    console.log(this.selectedCaterogies);
  }
}
