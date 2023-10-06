import express from "express";
import bodyParser from "body-parser";
import { createMember, getMemberByID } from "../db/memberService";

const memberManagementRouter = express.Router();
const jsonParser = bodyParser.json();

memberManagementRouter.post("/member/store", jsonParser, async (req, res) => {
  try {
    const data = req.body;

    data.createdAt = new Date();
    data.updatedAt = new Date();

    console.log(">>>> Masuk router store member with data: ", data);

    const response = await createMember(data);
    console.log("response new member data: ", response);

    if (!response) res.status(400).send(response);

    return res.status(200).send(response);
  } catch (error) {
    console.log(`error request new member data : ${JSON.stringify(error)}`);
    return res.status(403).send(error);
  }
});

memberManagementRouter.get("/member/detail", jsonParser, async (req, res) => {
  const data = req.body;
  const memberID: string = data.memberID;
  console.log(">>>> Masuk router get detail member with memberID: ", memberID);

  try {
    const response = await getMemberByID(memberID);
    console.log("response get member data: ", response);

    if (!response) res.status(400).send(response);

    return res.status(200).send(response);
  } catch (error) {
    console.log(`error request get member data : ${JSON.stringify(error)}`);
    return res.status(403).send(error);
  }
});

export { memberManagementRouter };
