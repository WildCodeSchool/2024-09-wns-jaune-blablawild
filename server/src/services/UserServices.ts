import { Response } from "express";
import * as jwt from "jsonwebtoken";

export const generateToken = (id: string, res: Response) => {
  if (!process.env.JWT_SECRET) throw new Error("Missing env variable");
  const tokenContent = { id };

  const token = jwt.sign(tokenContent, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
};
