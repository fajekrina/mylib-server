import express from "express";
import bodyParser from "body-parser";
import { bookReturn } from "../actions/bookReturn";

const returnManagementRouter = express.Router();
const jsonParser = bodyParser.json();

returnManagementRouter.post("/return/store", jsonParser, async (req, res) => {
  const data = req.body;
  const bookIDs = data.bookIDs;
  const memberID = data.memberID;
  console.log(">>>> Masuk router return book with data: ", data);

  try {
    const response = await bookReturn(memberID, bookIDs);

    if (response.error) return res.status(400).send(response.resultResponse);

    console.log("response return book data: ", response);

    return res.status(200).send(response);
  } catch (error) {
    console.log(`error request return book data : ${JSON.stringify(error)}`);
    return res.status(403).send(error);
  }
});

export { returnManagementRouter };
