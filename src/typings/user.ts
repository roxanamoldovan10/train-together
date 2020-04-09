interface CategoryObject {
  description: string;
  type: string;
  users: object;
}

interface UserProfileObject {
  name: string;
  username: string;
  gender: string;
  location: string;
}

interface UserObject extends UserProfileObject {
  categories: [object];
}
