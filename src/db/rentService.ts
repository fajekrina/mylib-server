import { createRef, db } from "../..";
import Rent from "../models/rent";
import { converter } from "../helpers/converter";

const create = async (data: Rent) => {
  if (!data) return undefined;

  try {
    const returnData = await db
      .collection("rents")
      .withConverter(converter<Rent>())
      .add(data)
      .then((docRef) => {
        const newData = { ...data, id: docRef.id };
        console.log("Rent document written with ID: ", newData.id);
        return newData;
      });

    return returnData;
  } catch (error) {
    console.error("error store new rent document", error);
    return undefined;
  }
};

const getByBookIDAndMemberID = async (bookID: string, memberID: string) => {
  if (!memberID || !bookID) return undefined;
  console.log(
    "getByBookIDAndMemberID params bookID: ",
    bookID + " memberID: " + memberID
  );

  try {
    const data = await db
      .collection("rents")
      .where("book", "==", createRef("books", bookID))
      .where("member", "==", createRef("members", memberID))
      .withConverter(converter<Rent>())
      .get()
      .then((snaps) => {
        // console.log("rent snaps >>> ", snaps);
        console.log("rent snaps.docs >>> ", snaps.docs);
        console.log("rent snaps.empty >>> ", snaps.empty);
        console.log("rent snaps.docs.length >>> ", snaps.docs.length);
        if (snaps.docs.length <= 0) {
          return undefined;
        } else {
          const snapDoc = snaps.docs.map((snap) => ({
            ...snap.data(),
            id: snap.id,
          }))[0];
          console.log("rent snapDoc >>> ", snapDoc);
          return snapDoc;
        }
      });

    return data;
  } catch (error) {
    console.log("error get book data ", error);
    return undefined;
  }
};

const update = async (rentID: string, data: any) => {
  if (!rentID || !data) return undefined;

  console.log("new update rent data ", data);

  try {
    await db.collection(`rents`).doc(rentID).update(data);

    console.log("new updated rent data: ", data);

    return data;
  } catch (error) {
    console.error("error update rent document with rentID", rentID);
    return undefined;
  }
};

export {
  create as createRent,
  update as updateRent,
  getByBookIDAndMemberID as getRentByBookIDAndMemberID,
};
