import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import firebase from 'firebase';
import _ from 'lodash';

@Component({
  template: 'find-partner.html',
  components: {},
})
export default class FindPartner extends Vue {
  private database: any;
  private categoriesRef?: any;
  private usersRef?: any;
  public user = {} as UserObject;
  public categories: CategoryObject[] = [];
  public selectedCategories: {}[] = [];
  public userUid = '';
  // Lifecycle hook
  mounted() {
    this.database = firebase.database();
    this.categoriesRef = this.database.ref('categories');
    this.usersRef = this.database.ref('users');
    this.getUserDetails();
    this.getCategoriesList();
  }

  /**
   * Request for current user deatils
   */
  getUserDetails() {
    const user = firebase.auth().currentUser;
    if (user) {
      this.userUid = user.uid;
      this.usersRef.child(user.uid).once('value', (snapshot: any) => {
        if (snapshot) {
          this.user = snapshot.val();
          this.user.categories = this.user.categories || [];
          this.getUsersCategories();
        }
      });
    }
  }

  /**
   *
   */
  getUsersCategories() {
    const userCategoriesKeys = Object.keys(this.user.categories).map(Number);
    userCategoriesKeys.forEach((key) => {
      if (
        this.categories[key] !== undefined &&
        this.categories[key].type !== undefined
      ) {
        this.selectedCategories[key] = {
          id: key,
          active: true,
          name: this.categories[key].type,
        };
      }
    });
  }

  /**
   * Request for list of categories
   */
  getCategoriesList() {
    this.categoriesRef.on('value', (snapshot: any) => {
      if (snapshot) {
        this.categories = { ...snapshot.val() };
      }
    });
  }

  removeSelectedCategory(index: number) {
    this.selectedCategories.splice(index, 1);
  }

  hasCateg(index: any) {
    return this.selectedCategories.some((selected: any) => {
      return selected.id === parseInt(index);
    });
  }
}
