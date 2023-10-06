import { createRef } from "../..";
import { getBookByID, updateBook } from "../db/bookService";
import { getMemberByID } from "../db/memberService";
import { createRent } from "../db/rentService";
import { resultCode } from "../helpers/resultCode";
import { addDays, endOfDay } from "date-fns";
import Rent from "../models/rent";

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
  errorMessage?: resultResponse;
};

export type Result = {
  error?: boolean;
  resultResponse?: resultResponse;
  jsonResponse?: rentResult[];
};

export const bookRent = async (
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

  if (memberData.suspendRentUntil && memberData.suspendRentUntil < new Date())
    return {
      error: true,
      resultResponse: resultCode(
        "Rent",
        "05",
        memberData.suspendRentUntil.toDateString()
      ),
      jsonResponse: undefined,
    };

  if (
    memberData.allowedBookRented &&
    memberData.allowedBookRented < bookIDs.length
  )
    return {
      error: true,
      resultResponse: resultCode(
        "Rent",
        "04",
        String(memberData.allowedBookRented)
      ),
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

    if (!bookData.stock) {
      result.push({
        success: false,
        bookID: bookID,
        errorMessage: resultCode("Book", "07", bookID),
      });

      continue;
    }

    console.log("book data before updated: ", bookData);

    const currentDate = new Date();
    const maxReturnedAt = endOfDay(addDays(currentDate, 7));

    const newRentDoc: Rent = {
      member: createRef("members", memberID),
      book: createRef("books", bookID),
      isReturned: false,
      maxReturnedAt: maxReturnedAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("newRentDoc ", newRentDoc);

    const rentResponse = await createRent(newRentDoc);
    if (!rentResponse) {
      result.push({
        success: false,
        bookID: bookID,
        errorMessage: resultCode("Rent", "06", "Rent"),
      });

      continue;
    }

    bookData.stock = Number(bookData.stock) - 1;
    if (bookData.updatedAt) bookData.updatedAt = new Date();

    await updateBook(bookID, bookData);

    console.log("book data after updated: ", bookData);

    result.push({
      success: true,
      rentID: rentResponse.id,
      bookID: bookID,
      maxReturnTime: maxReturnedAt,
    });
  }

  return {
    error: false,
    resultResponse: resultCode("Rent", "00", undefined),
    jsonResponse: result,
  };
};
