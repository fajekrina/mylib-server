import firebase from "firebase/compat/app";

export function converter<T>() {
  return {
    toFirestore: (data: T) => data,
    fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) => {
      return snap.data() as T;
    },
  };
}
