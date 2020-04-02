import Vue from "vue";
import { Component } from "vue-property-decorator";
import firebase from "firebase";

@Component({
  template: "./settings.html",
  components: {}
})
export default class Settings extends Vue {
  // Data property
  private database?: any;
  private categoriesRef?: any;
  private usersRef?: any;
  public categories: categoryObject[] = [];
  public user = {
    name: "",
    username: "",
    gender: "",
    location: "",
    categories: []
  };
  public userUid = "";

  public selectedOptions: categoryObject[] = [];
  public updateObject?: any;

  // Lifecycle hook
  mounted() {
    this.database = firebase.database();
    this.categoriesRef = this.database.ref("categories");
    this.usersRef = this.database.ref("users");
    this.getCategoriesList();
    this.getUserDetails();
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

  /**
   * REquest for current user deatils
   */
  getUserDetails() {
    const user = firebase.auth().currentUser;
    if (user) {
      this.userUid = user.uid;
      this.usersRef.child(user.uid).once("value", (snapshot: any) => {
        if (snapshot) {
          this.user = snapshot.val();
          if (this.user.categories) {
            this.getUserCategories();
          }
        }
      });
    }
  }

  getUserCategories() {
    const userCategoriesKeys = Object.keys(this.user.categories).map(Number);
    userCategoriesKeys.forEach((categoryKey: number) => {
      console.log(this.categories, "categories");
      this.selectedOptions.push(this.categories[categoryKey]);
    });
  }

  isActive(category: categoryObject) {
    const isActive = this.selectedOptions.some(
      selected => selected === category
    );
    return isActive;
  }

  /**
   * Updates user profile and category table for current user
   */
  updateProfile({ username, name, gender, location, categories }: any) {
    // aSTEA CE TYPE IS???
    this.updateObject = {};
    this.user.categories = this.user.categories || [];

    const categoryUserOptions = {
      name: name,
      username: username,
      gender: gender,
      location: location
    };

    const userOptions = {
      name: name,
      username: username,
      gender: gender,
      location: location,
      categories: this.user.categories
    };

    if (this.selectedOptions && this.selectedOptions.length) {
      this.setUserCategory(categoryUserOptions);
    }

    // Bulk update user and categories db objects
    if (this.user.categories) {
      const userCategories = Object.keys(this.user.categories);
      userCategories.forEach(key => {
        this.updateObject[
          `categories/${key}/users/${this.userUid}`
        ] = categoryUserOptions;
      });
    }
    this.updateObject[`users/${this.userUid}`] = userOptions;

    return this.database.ref().update(this.updateObject);
  }

  /**
   * Inserts selected categories in user db object
   * Inserts user in selected categories
   */
  setUserCategory(categoryUserOptions: any) {
    return this.selectedOptions.forEach((option: any) => {
      if (typeof option === "string") {
        this.usersRef
          .child(this.userUid + "/categories/")
          .child(option)
          .set(true);
        this.categoriesRef
          .child(option + "/users/" + this.userUid)
          .set(categoryUserOptions);
        this.user.categories.push({ option: true });
      }
    });
  }
}
