import express from "express";
import bodyParser from "body-parser";
import { createMember, getMemberByID } from "../db/memberService";
import { bookRent } from "../actions/bookRent";

const rentManagementRouter = express.Router();
const jsonParser = bodyParser.json();

rentManagementRouter.post("/rent/store", jsonParser, async (req, res) => {
  const data = req.body;
  const bookIDs = data.bookIDs;
  const memberID = data.memberID;
  console.log(">>>> Masuk router store rent with data: ", data);

  try {
    const response = await bookRent(memberID, bookIDs);

    if (response.error) return res.status(400).send(response.resultResponse);

    console.log("response new rent data: ", response);

    return res.status(200).send(response);
  } catch (error) {
    console.log(`error request new rent data : ${JSON.stringify(error)}`);
    return res.status(403).send(error);
  }
});

export { rentManagementRouter };
