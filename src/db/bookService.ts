import { db } from "../..";
import { converter } from "../helpers/converter";
import Book from "../models/book";

const getByID = async (bookID: string) => {
  try {
    const data = await db
      .collection("books")
      .withConverter(converter<Book>())
      .doc(bookID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return { ...doc.data() };
        } else {
          console.log("No such book document!");
          return undefined;
        }
      });

    return data;
  } catch (error) {
    console.log("error get book data ", error);
    return undefined;
  }
};

const create = async (data: Book) => {
  if (!data) return undefined;

  try {
    const returnData = await db
      .collection("books")
      .withConverter(converter<Book>())
      .doc(data.code)
      .set(data, { merge: true })
      .then(() => {
        const newData = { ...data };
        console.log("Book document written with ID: ", newData.code);
        return newData;
      });

    return returnData;
  } catch (error) {
    console.error("error store new book document", error);
    return undefined;
  }
};

const update = async (bookID: string, data: any) => {
  if (!bookID || !data) return undefined;

  console.log("new update book data ", data);

  try {
    await db.collection(`books`).doc(bookID).update(data);

    console.log("new updated book data: ", data);

    return data;
  } catch (error) {
    console.error("error update book document with bookID", bookID);
    return undefined;
  }
};

export { create as createBook, update as updateBook, getByID as getBookByID };
