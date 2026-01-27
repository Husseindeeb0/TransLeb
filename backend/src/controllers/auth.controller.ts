import {
  SigninRequest,
  SignupRequest,
  AuthResponse,
} from "../types/userTypes";
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
    const { name, email, password, role }: SignupRequest = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        state: "USER_ALREADY_EXISTS",
        message: "User already exists",
      });
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

    const response: AuthResponse = {
      _id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      message: "User created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Internal server error during signup",
    });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const { email, password }: SigninRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        state: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        state: "USER_NOT_FOUND",
        message: "Invalid email or password",
      });
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    setTokenCookies(res, accessToken, refreshToken);
    user.refreshToken = refreshToken;
    await user.save();

    const response: AuthResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      message: "User signed in successfully",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Internal server error during signin",
    });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!cookies.access_token || !cookies.refresh_token) {
      return res.status(400).json({
        state: "MISSING_TOKENS",
        message: "No access or refresh token in cookies",
      });
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
    console.error("Logout error:", error);
    res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Internal server error during logout",
    });
  }
};

export { signup, signin, logout };
