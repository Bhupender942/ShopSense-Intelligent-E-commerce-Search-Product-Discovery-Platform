import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_LIFETIME = process.env.JWT_LIFETIME || "30d";

interface TokenPayload {
  userId: string;
  name: string;
  email: string;
}

export const createJWT = (user: IUser): string => {
  const payload: TokenPayload = {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_LIFETIME,
  });
};

export const verifyJWT = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const attachCookiesToResponse = (res: Response, token: string): void => {
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

export const createTokenUser = (user: IUser): TokenPayload => {
  return {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
  };
};
