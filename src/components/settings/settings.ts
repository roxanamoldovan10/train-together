import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import firebase from 'firebase';

@Component({
  template: './settings.html',
  components: {},
})
export default class Settings extends Vue {
  // Data property
  private database: any;
  private categoriesRef?: any;
  private usersRef?: any;
  public categories: CategoryObject[] = [];
  public userUid = '';
  public user = {} as UserObject;
  public categoryUserOptions!: UserProfileObject;

  public selectedOptions: {}[] = [];
  public updateObject?: any;

  // Lifecycle hook
  mounted() {
    this.database = firebase.database();
    this.categoriesRef = this.database.ref('categories');
    this.usersRef = this.database.ref('users');
    this.getCategoriesList();
    this.getUserDetails();
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
          this.categoryUserOptions = {
            name: this.user.name,
            username: this.user.username,
            gender: this.user.gender,
            location: this.user.location,
          };
          if (this.user.categories) {
            this.getUserSelectedCategories();
          }
        }
      });
    }
  }

  /**
   * Assign keys for user selected categories
   */
  getUserSelectedCategories() {
    const userCategoriesKeys = Object.keys(this.user.categories).map(Number);
    userCategoriesKeys.forEach((categoryKey: number) => {
      this.selectedOptions.push(categoryKey);
    });
  }

  /**
   * Updates user profile
   * @returns {Promise}
   */
  updateProfile({ username, name, gender, location }: any) {
    // aSTEA CE TYPE IS???
    this.updateObject = {};
    this.user.categories = this.user.categories || [];

    this.categoryUserOptions = {
      name: this.user.name,
      username: this.user.username,
      gender: this.user.gender,
      location: this.user.location,
    };

    const userOptions = {
      name: name,
      username: username,
      gender: gender,
      location: location,
      categories: this.user.categories,
    };

    // Bulk update user and categories db objects
    if (this.user.categories) {
      const userCategories = Object.keys(this.user.categories);
      userCategories.forEach((key) => {
        this.updateObject[
          `categories/${key}/users/${this.userUid}`
        ] = this.categoryUserOptions;
      });
    }
    this.updateObject[`users/${this.userUid}`] = userOptions;

    return this.database.ref().update(this.updateObject);
  }

  /**
   * Add/Remove user category
   */
  updateUserCategories(index: string) {
    const categoryId = parseInt(index);
    const isSelected = this.selectedOptions.some((selected) => {
      if (typeof selected === 'string') selected = parseInt(selected);
      return selected === categoryId;
    });

    if (isSelected) {
      return this.addUserCategory(categoryId);
    }
    return this.removeUserCategory(categoryId);
  }

  /**
   * Add selected category to user
   * Add user to category
   * @param categoryId
   */
  addUserCategory(categoryId: number) {
    this.usersRef
      .child(this.userUid + '/categories/')
      .child(categoryId)
      .set(true);
    this.categoriesRef
      .child(categoryId + '/users/' + this.userUid)
      .set(this.categoryUserOptions);
    if (categoryId != null) {
      this.user.categories.push({ categoryId: true });
    }
    this.user.categories.push({ categoryId: true });
    this.$buefy.toast.open({
      message: 'Category updated',
      position: 'is-top-right',
      type: 'is-success',
    });
  }

  /**
   * Removes selected category from user
   * Removes user from category
   * @param categoryId
   */
  removeUserCategory(categoryId: number) {
    // messagesRef.child(message.id).remove()
    this.usersRef
      .child(this.userUid + '/categories/')
      .child(categoryId)
      .remove();
    this.categoriesRef.child(categoryId + '/users/' + this.userUid).remove();
    this.$buefy.toast.open({
      message: 'Category removed',
      position: 'is-top-right',
      type: 'is-danger',
    });
  }
}
