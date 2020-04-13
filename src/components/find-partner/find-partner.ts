import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import firebase from 'firebase';
import _ from 'lodash';
import { parse } from '@fortawesome/fontawesome-svg-core';

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
  public userSelectedCategories: CategoryObject[] = [];
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
          this.getUserselectedCategories();
        }
      });
    }
  }

  /**
   * Request for list of categories
   */
  getCategoriesList() {
    this.categoriesRef.on('value', (snapshot: any) => {
      if (snapshot) {
        this.categories = snapshot.val();
      }
    });
  }

  /**
   * Returns user initial categories (by his selected categories)
   */
  getUserselectedCategories() {
    const userCategoriesKeys = Object.keys(this.user.categories);
    Object.keys(this.categories).forEach((categoryKey: string) => {
      const userHasCategory = userCategoriesKeys.some(
        (categ) => categ === categoryKey,
      );
      if (userHasCategory) {
        this.userSelectedCategories[categoryKey] = this.categories[categoryKey];
      }
    });
  }

  getType(index: string) {
    if (this.user && this.user.categories) {
      const userHasCateg = Object.keys(this.user.categories).some(
        (userCateg) => userCateg === index,
      );
      if (!userHasCateg) return '';
      // this.selectedCategories.push(index);

      return userHasCateg ? 'is-primary' : '';
    }
  }

  updateCategoriesList(index: number) {
    this.userSelectedCategories[index] = this.categories[index];
    console.log(this.userSelectedCategories);
  }
}
