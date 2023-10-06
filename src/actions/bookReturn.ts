import { createRef } from "../..";
import { getBookByID, updateBook } from "../db/bookService";
import { getMemberByID } from "../db/memberService";
import { getRentByBookIDAndMemberID, updateRent } from "../db/rentService";
import { resultCode } from "../helpers/resultCode";
import { addDays, endOfDay } from "date-fns";
import firebase from "firebase/compat/app";

export type resultResponse = {
  type: string;
  message: string;
  code: number;
};

export type rentResult = {
  success: boolean;
  rentID?: string;
  bookID?: string;
  maxReturnTime?: Date;
  isDelayed?: boolean;
  pinaltyRentUntil?: Date;
  errorMessage?: resultResponse;
};

export type Result = {
  error?: boolean;
  resultResponse?: resultResponse;
  jsonResponse?: rentResult[];
};

export const bookReturn = async (
  memberID: string,
  bookIDs: string[]
): Promise<Result> => {
  const memberData = await getMemberByID(memberID);

  console.log("response member Data ", memberData);

  if (!memberData)
    return {
      error: true,
      resultResponse: resultCode("Member", "03", memberID),
      jsonResponse: undefined,
    };

  const result = [];

  for (const bookID of bookIDs) {
    console.log(`bookID: ${bookID}`);

    const bookData = await getBookByID(bookID);

    if (!bookData) {
      result.push({
        success: false,
        bookID: bookID,
        errorMessage: resultCode("Book", "03", bookID),
      });

      continue;
    }

    console.log("bookData before updated: ", bookData);

    const memberRef = createRef("members", memberID);
    const bookRef = createRef("books", bookID);

    console.log("memberRef : ", memberRef.id);
    console.log("bookRef : ", bookRef.id);

    const rentData = await getRentByBookIDAndMemberID(bookID, memberID);
    console.log("rentData : ", rentData);

    if (!rentData || !rentData.id) {
      result.push({
        success: false,
        bookID: bookID,
        errorMessage: resultCode("Rent", "06", "Rent"),
      });

      continue;
    }

    console.log("rentData before updated: ", rentData);

    const maxReturnDate =
      rentData.maxReturnedAt instanceof firebase.firestore.Timestamp
        ? new Date(rentData.maxReturnedAt.seconds * 1000)
        : rentData.maxReturnedAt;

    if (maxReturnDate < new Date()) {
      const currentDate = new Date();
      const pinaltyRentUntil = endOfDay(addDays(currentDate, 3));

      rentData.isDelayed = true;
      rentData.pinaltyRentUntil = pinaltyRentUntil;
    }

    rentData.returnedAt = new Date();
    rentData.updatedAt = new Date();
    rentData.isReturned = true;

    await updateRent(rentData.id, rentData);

    console.log("rentData after updated: ", rentData);

    bookData.stock = Number(bookData.stock) + 1;
    if (bookData.updatedAt) bookData.updatedAt = new Date();

    await updateBook(bookID, bookData);

    console.log("bookData after updated: ", bookData);

    result.push({
      success: true,
      rentID: rentData.id,
      bookID: bookID,
      isDelayed: rentData.isDelayed,
      pinaltyRentUntil: rentData.pinaltyRentUntil,
      maxReturnTime: rentData.maxReturnedAt,
    });
  }

  return {
    error: false,
    resultResponse: resultCode("Rent", "00", undefined),
    jsonResponse: result,
  };
};
