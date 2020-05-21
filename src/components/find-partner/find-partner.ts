import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
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
  created() {
    this.categories = this.getCategories;
    this.friendList = this.getUserFriendList || [];
    console.log('Find-partner - friend list - mounted: ', this.friendList);
  }

  @Watch('friendList', {
    deep: true,
  })
  public friendListChanged(): void {
    console.log(
      'The friendslist got updated!',
      this.friendList,
      this.getUserFriendList,
    );
  }

  public async sendFriendRequest(index: string) {
    console.log('sent');
    await this.addConnection(index).then(() => {
      this.friendList = this.getUserFriendList || [];
      console.log(this.friendList, 'friendlist here?!!!?');
      console.log(' friend list - sent request: ', this.getUserFriendList);
    });
    // this.$set(this.friendList, this.getUserFriendList)
    // const test = await this.getUserFriendList;
    // Vue.set(this.friendList, 0, test);
    // console.log(this.friendList);
  }
}
