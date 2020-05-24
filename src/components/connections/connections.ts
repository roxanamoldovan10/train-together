import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { userGetters, userActions } from '../../typings/user';
import firebase from '@/config/firebase-config';

const userModule = namespace('userModule');

@Component({
  template: './connections.html',
  components: {},
})
export default class Connections extends Vue {
  // Data property
  public friendList: { [key: string]: string } = {};
  public pendingConnections: { [key: string]: string } = {};
  public acceptedConnections: { [key: string]: string } = {};

  @userModule.Getter(userGetters.GetUserFriendList)
  public getUserFriendList!: { [key: string]: string };

  @userModule.Action(userActions.AcceptConnection)
  public acceptConnection!: (payload: string) => Promise<UserObject>;

  @userModule.Action(userActions.DeclineConnection)
  public declineConnection!: (payload: string) => Promise<UserObject>;

  // Lifecycle hook

  // Get user pending connections/friends
  public get userPendingConnections() {
    const friendList = this.getUserFriendList;
    const userPendingConnections = Object.keys(friendList).filter(
      (connection: string) => friendList[connection] === 'review',
    );
    userPendingConnections.forEach((connection) => {
      this.retriveUserById(connection).then((user: string) => {
        Vue.set(this.pendingConnections, connection, user);
      });
    });
    return this.pendingConnections;
  }

  // Get user accepted connections/friends
  public get userAcceptedConnections() {
    const friendList = this.getUserFriendList;
    const userAcceptedConnections = Object.keys(friendList).filter(
      (connection: string) => friendList[connection] === 'accepted',
    );
    userAcceptedConnections.forEach((connection) => {
      this.retriveUserById(connection).then((user: string) => {
        Vue.set(this.acceptedConnections, connection, user);
      });
    });

    return this.acceptedConnections;
  }

  // Return user by id
  retriveUserById(userId: string): Promise<string> {
    return new Promise((resolve) => {
      const query = firebase.usersRef.child(userId + '/name');
      query.on('value', (snapshot: any) => {
        if (snapshot) {
          resolve(snapshot.val());
        }
      });
    });
  }

  acceptFriendRequest(index: string) {
    this.acceptConnection(index);
    delete this.pendingConnections[index];
  }

  declineFriendRequest(index: string) {
    this.declineConnection(index);
    delete this.pendingConnections[index];
    this.getUserFriendList;
    console.log(this.pendingConnections);
  }
}
