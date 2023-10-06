import firebase from "firebase/compat/app";

export default interface Book {
  code: string;
  title: string;
  author: string;
  stock: number;
  createdAt: firebase.firestore.Timestamp | Date;
  updatedAt: firebase.firestore.Timestamp | Date;
}
