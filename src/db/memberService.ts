import { db } from "../..";
import { converter } from "../helpers/converter";
import Member from "../models/member";

const getByID = async (memberID: string) => {
  try {
    const data = await db
      .collection("members")
      .withConverter(converter<Member>())
      .doc(memberID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return { ...doc.data() };
        } else {
          console.log("No such member document!");
          return undefined;
        }
      });

    return data;
  } catch (error) {
    console.log("error get member data ", error);
    return undefined;
  }
};

const create = async (data: Member) => {
  if (!data) return undefined;

  try {
    const returnData = await db
      .collection("members")
      .withConverter(converter<Member>())
      .doc(data.code)
      .set(data, { merge: true })
      .then(() => {
        const newData = { ...data };
        console.log("Member document written with ID: ", newData.code);
        return newData;
      });

    return returnData;
  } catch (error) {
    console.error("error store new member document", error);
    return undefined;
  }
};

export { create as createMember, getByID as getMemberByID };
