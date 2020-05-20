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
  public friendList: { [key: string]: string } = {};
  public userPendingConnections: { [key: string]: string } = {};
  public userAcceptedConnections: { [key: string]: string } = {};

  @userModule.Getter(userGetters.GetUserFriendList)
  public getUserFriendList!: { [key: string]: string };

  @userModule.Action(userActions.AddConnection)
  public addConnection!: (payload: string) => Promise<UserObject>;

  @userModule.Action(userActions.AcceptConnection)
  public acceptConnection!: (payload: string) => Promise<UserObject>;

  @userModule.Action(userActions.DeclineConnection)
  public declineConnection!: (payload: string) => Promise<UserObject>;

  @usersModule.Getter(usersGetters.GetUsers)
  public getUsers!: [];

  @usersModule.Getter(usersGetters.GetPendingUsers)
  public getPendingUsers!: { [key: string]: string };

  @usersModule.Getter(usersGetters.GetAcceptedUsers)
  public getAcceptedUsers!: { [key: string]: string };

  @usersModule.Action(usersActions.UserList)
  public userList!: () => Promise<UserObject>;

  @usersModule.Action(usersActions.UserConnections)
  public userConnections!: (paylod: any) => Promise<UserObject>;

  // Lifecycle hook
  mounted() {
    this.userList();
    this.friendList = this.getUserFriendList || {};
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
      this.userPendingConnections = this.getPendingUsers;
      this.userAcceptedConnections = this.getAcceptedUsers;
      return;
    });
  }

  declineFriendRequest(index: string) {
    this.declineConnection(index).then(() => {
      console.log('done');
      this.userPendingConnections = this.getPendingUsers;
      this.userAcceptedConnections = this.getAcceptedUsers;
      return;
    });
  }
}
