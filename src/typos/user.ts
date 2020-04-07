interface categoryObject {
  description: string;
  type: string;
  users: object;
}

interface userProfileObject {
  name: string;
  username: string;
  gender: string;
  location: string;
}

interface userObject extends userProfileObject {
  categories: [object];
}
