import firebase from "firebase/compat/app";

export default interface Member {
  code: string;
  name: string;
  allowedBookRented: number;
  suspendRentUntil?: Date;
  createdAt: firebase.firestore.Timestamp | Date;
  updatedAt: firebase.firestore.Timestamp | Date;
}
