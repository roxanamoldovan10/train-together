import Vue from "vue";
import { Component } from "vue-property-decorator";
import firebase from "firebase";

@Component({
  template: "find-partner.html",
  components: {}
})
export default class FindPartner extends Vue {
  public usersList?;
  private database?: any;
  private categoriesRef?: any;
  public user: userObject = {};
  public categories: categoryObject[] = [];
  public selectedCaterogies: {}[] = [];
  // Lifecycle hook
  mounted() {
    this.database = firebase.database();
    this.categoriesRef = this.database.ref("categories");
    this.user = JSON.parse(sessionStorage.user);
    this.categories = JSON.parse(sessionStorage.categories);
    console.log(this.categories);
    this.getUsersCategories();
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
      }
    });
  }

  removeSelectedCategory(index: number) {
    this.selectedCaterogies.splice(index, 1);
  }
}
