import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import { firebaseConfig } from "./firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import cors from "cors";
import { bookManagementRouter } from "./src/routers/bookManagement";
import { memberManagementRouter } from "./src/routers/memberManagement";
import { rentManagementRouter } from "./src/routers/rentManagement";
import { returnManagementRouter } from "./src/routers/returnManagement";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3001;

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export const createRef = (collection: string, docId: string) =>
  db.doc(`${collection}/` + docId);

app.use(cors());
app.use(bookManagementRouter);
app.use(memberManagementRouter);
app.use(rentManagementRouter);
app.use(returnManagementRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
