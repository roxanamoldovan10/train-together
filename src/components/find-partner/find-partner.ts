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
  public friendList: { [key: string]: string } = {};

  @categoriesModule.Getter(CategoriesGetters.GetCategories)
  public getCategories!: CategoryObject[];

  @userModule.Getter(userGetters.GetUserFriendList)
  public getUserFriendList!: { [key: string]: string };

  @userModule.Action(userActions.AddConnection)
  public addConnection!: (payload: string) => Promise<UserObject>;

  // Lifecycle hook
  mounted() {
    this.categories = this.getCategories;
    this.friendList = this.getUserFriendList || [];
    console.log('Find-partner - friend list - mounted: ', this.friendList);
  }

  async sendFriendRequest(index: string) {
    console.log('sent');
    await this.addConnection(index);
    this.friendList = this.getUserFriendList || [];
    // this.$set(this.friendList, this.getUserFriendList)
    console.log(' friend list - sent request: ', this.getUserFriendList);
    // const test = await this.getUserFriendList;
    // Vue.set(this.friendList, 0, test);
    // console.log(this.friendList);
  }
}
