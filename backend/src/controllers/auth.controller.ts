import { UserType } from "../types";
import User from "../models/User";
import {
  generateToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
  setTokenCookies,
} from "../utils";
import { Request, Response } from "express";

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role }: UserType = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const accessToken = generateToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    setTokenCookies(res, accessToken, refreshToken);
    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.status(201).json({
        message: "User created successfully",
    })
  } catch (error) {
    console.log(error);
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const { email, password }: UserType = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
 
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    setTokenCookies(res, accessToken, refreshToken);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ message: "User signed in successfully" });
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!cookies.access_token || !cookies.refresh_token) {
      return res.status(400).json({ message: "No access or refresh token in cookies" });
    }

    res.cookie("access_token", "", { httpOnly: true, maxAge: 0 });
    res.cookie("refresh_token", "", { httpOnly: true, maxAge: 0 });

    const user = await User.findOne({ refreshToken: cookies.refresh_token });
    if (user) {
      user.refreshToken = "";
      await user.save();
    }

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
  }
};

export { signup, signin, logout };
