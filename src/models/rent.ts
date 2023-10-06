import firebase from "firebase/compat/app";

export default interface Rent {
  id?: string;
  member: firebase.firestore.DocumentReference;
  book: firebase.firestore.DocumentReference;
  isReturned: boolean;
  isDelayed?: boolean;
  maxReturnedAt: Date;
  returnedAt?: Date;
  pinaltyRentUntil?: Date;
  createdAt: firebase.firestore.Timestamp | Date;
  updatedAt: firebase.firestore.Timestamp | Date;
}
