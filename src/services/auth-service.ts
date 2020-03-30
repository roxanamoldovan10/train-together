import firebase from "firebase";

export default function authService(email: string, password: string) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}
