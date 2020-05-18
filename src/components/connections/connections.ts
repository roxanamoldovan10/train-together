import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { userGetters, userActions } from '../../typings/user';
import { usersGetters, usersActions } from '../../typings/users';

const userModule = namespace('userModule');
const usersModule = namespace('usersModule');

@Component({
  template: './connections.html',
  components: {},
})
export default class Connections extends Vue {
  // Data property
  public friendList: [] = [];
  public userPendingConnections: [] = [];
  public userAcceptedConnections: [] = [];

  @userModule.Getter(userGetters.GetUserFriendList)
  public getUserFriendList!: [];

  @userModule.Action(userActions.AddConnection)
  public addConnection!: (payload: string) => Promise<UserObject>;

  @userModule.Action(userActions.AcceptConnection)
  public acceptConnection!: (payload: string) => Promise<UserObject>;

  @usersModule.Getter(usersGetters.GetUsers)
  public getUsers!: [];

  @usersModule.Getter(usersGetters.GetPendingUsers)
  public getPendingUsers!: [];

  @usersModule.Getter(usersGetters.GetAcceptedUsers)
  public getAcceptedUsers!: [];

  @usersModule.Action(usersActions.UserList)
  public userList!: () => Promise<UserObject>;

  @usersModule.Action(usersActions.UserConnections)
  public userConnections!: (paylod: any) => Promise<UserObject>;

  // Lifecycle hook
  mounted() {
    this.userList();
    this.friendList = this.getUserFriendList || [];
    const options = {
      friendList: this.friendList,
    };
    this.userConnections(options);
    this.userPendingConnections = this.getPendingUsers;
    this.userAcceptedConnections = this.getAcceptedUsers;
  }

  acceptFriendRequest(index: string) {
    this.acceptConnection(index).then(() => {
      console.log('done');
    });
  }
}
