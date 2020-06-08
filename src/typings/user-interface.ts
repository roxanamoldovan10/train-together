interface CategoryObject {
  description: string;
  type: string;
  users: Array<any>;
}

interface UserProfileObject {
  name: string;
  username: string;
  gender: string;
  location: string;
}

interface UserObject extends UserProfileObject {
  categories: [];
  friendList: { [key: string]: string };
}
