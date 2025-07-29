import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/auth";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        name: string;
        email: string;
      };
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Check for token in cookies first
    let token = req.signedCookies.token;

    // If no token in cookies, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      res.status(401).json({ message: "Authentication invalid" });
      return;
    }

    const payload = verifyJWT(token);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication invalid" });
  }
};
