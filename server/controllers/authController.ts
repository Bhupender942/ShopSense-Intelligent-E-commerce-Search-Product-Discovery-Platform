import { Request, Response } from "express";
import User from "../models/User";
import { createJWT, attachCookiesToResponse } from "../utils/auth";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = createJWT(user);

    // Attach cookie and send response
    attachCookiesToResponse(res, token);

    res.status(201).json({
      user: {
        name: user.name,
        email: user.email,
        userId: user._id,
      },
      token, // Include token in response
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate token
    const token = createJWT(user);

    // Attach cookie and send response
    attachCookiesToResponse(res, token);

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        userId: user._id,
      },
      token, // Include token in response
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({ message: "User logged out!" });
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Authentication invalid" });
    return;
  }

  res.status(200).json({ user: req.user });
};
