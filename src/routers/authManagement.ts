import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import jwt, { Secret, verify } from "jsonwebtoken";
import axios from "axios";

const authManagementRouter = express.Router();
const jsonParser = bodyParser.json();

const secretKey: Secret = "rahasia";

const jwtOptions: jwt.SignOptions = {
  expiresIn: "1h",
  algorithm: "HS256",
};

authManagementRouter.post(
  "/login",
  jsonParser,
  (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username === "user" && password === "password") {
      const token = jwt.sign({ username }, secretKey, jwtOptions);
      res.json({ token });
    } else {
      res.status(401).json({ message: "Login gagal" });
    }
  }
);

authManagementRouter.post(
  "/clockin",
  jsonParser,
  authorize,
  async (req: Request, res: Response) => {
    const ipAddress = req.ip;
    const { latitude, longitude } = req.body;

    try {
      await axios.post("https://endpoint-sistem-eksternal/clockin", {
        ipAddress,
        latitude,
        longitude,
        username: req.body.user.username,
      });
      res.json({ message: "Clock In berhasil" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat melakukan Clock In" });
    }
  }
);

authManagementRouter.post(
  "/clockout",
  jsonParser,
  authorize,
  async (req: Request, res: Response) => {
    const ipAddress = req.ip;
    const { latitude, longitude } = req.body;

    try {
      await axios.post("https://endpoint-sistem-eksternal/clockout", {
        ipAddress,
        latitude,
        longitude,
        username: req.body.user.username,
      });
      res.json({ message: "Clock Out berhasil" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat melakukan Clock Out" });
    }
  }
);

function authorize(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    const decoded = verify(token, secretKey);
    req.body.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
}

export { authManagementRouter };
