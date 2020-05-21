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

  @categoriesModule.Getter(CategoriesGetters.GetCategories)
  public getCategories!: CategoryObject[];

  @userModule.Getter(userGetters.GetUserFriendList)
  public getUserFriendList!: { [key: string]: string };

  @userModule.Action(userActions.AddConnection)
  public addConnection!: (payload: string) => Promise<UserObject>;

  // Lifecycle hook
  created() {
    this.categories = this.getCategories;
  }

  public get friendList() {
    return this.getUserFriendList;
  }

  public sendFriendRequest(index: string): void {
    this.addConnection(index);
  }
}
