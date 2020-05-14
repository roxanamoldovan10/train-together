import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { CategoriesGetters } from '../../typings/categories';
import { userGetters, userActions } from '../../typings/user';

const categoriesModule = namespace('categoriesModule');
const userModule = namespace('userModule');

@Component({
  template: './find-partner.html',
  components: {},
})
export default class FindPartner extends Vue {
  // Data property
  public categories: CategoryObject[] = [];
  public selectedOptions: Array<number> = [];
  public friendList: [] = [];

  @categoriesModule.Getter(CategoriesGetters.GetCategories)
  public getCategories!: CategoryObject[];

  @userModule.Getter(userGetters.GetUserFriendList)
  public getUserFriendList!: [];

  @userModule.Action(userActions.AddConnection)
  public addConnection!: (payload: string) => Promise<UserObject>;

  // Lifecycle hook
  mounted() {
    this.categories = this.getCategories;
    this.friendList = this.getUserFriendList || [];
    console.log('aaa ', this.friendList);
  }

  sendFriendRequest(index: string) {
    console.log('sent');
    this.addConnection(index);
    this.isFriendRequestSent(index);
  }

  isFriendRequestSent(index: string) {
    return Object.prototype.hasOwnProperty.call(this.friendList, index);
  }
}
