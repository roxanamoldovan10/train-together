import firebaseConfig from '@/services/firebase-config';

export default class UsersService {
  public createUserProfile(userUid: string, userDetails: UserProfileObject) {
    return firebaseConfig.usersRef.child(userUid).set({
      name: userDetails.name,
      username: userDetails.username,
      gender: userDetails.gender,
      location: userDetails.location,
    });
  }
}

export const usersService = new UsersService();
