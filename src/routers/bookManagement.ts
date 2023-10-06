import express from "express";
import bodyParser from "body-parser";
import { createBook, getBookByID } from "../db/bookService";

const bookManagementRouter = express.Router();
const jsonParser = bodyParser.json();

bookManagementRouter.get("/book/detail", jsonParser, async (req, res) => {
  const data = req.body;
  const bookID: string = data.bookID;
  console.log(">>>> Masuk router get detail book with bookID: ", bookID);

  try {
    const response = await getBookByID(bookID);
    console.log("response get book data: ", response);

    if (!response) res.status(400).send(response);

    return res.status(200).send(response);
  } catch (error) {
    console.log(`error request get book data : ${JSON.stringify(error)}`);
    return res.status(403).send(error);
  }
});

bookManagementRouter.post("/book/store", jsonParser, async (req, res) => {
  try {
    const data = req.body;

    data.createdAt = new Date();
    data.updatedAt = new Date();

    console.log(">>>> Masuk router store book with data: ", data);

    const response = await createBook(data);
    console.log("response new book data: ", response);

    if (!response) res.status(400).send(response);

    return res.status(200).send(response);
  } catch (error) {
    console.log(`error request new book data : ${JSON.stringify(error)}`);
    return res.status(403).send(error);
  }
});

export { bookManagementRouter };
