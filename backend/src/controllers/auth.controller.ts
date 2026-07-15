import { SigninRequest, SignupRequest, AuthResponse } from "../types/userTypes";
import { prisma } from "../config/prisma";
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

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({
        state: "USER_ALREADY_EXISTS",
        message: "User already exists",
      });
    }

    const hashedPassword = hashPassword(password);
    
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as any,
      },
    });

    const userPayload = {
      ...newUser,
      coordinates: newUser.id,
    } as any;

    const accessToken = generateToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);
    setTokenCookies(res, accessToken, refreshToken);

    await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken },
    });

    const response: AuthResponse = {
      id: newUser.id,
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

    const user = await prisma.user.findUnique({ where: { email } });
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

    const userPayload = {
      ...user,
      coordinates: user.id,
    } as any;

    const accessToken = generateToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);
    setTokenCookies(res, accessToken, refreshToken);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const response: AuthResponse = {
      id: user.id,
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

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("access_token", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 0,
    });
    res.cookie("refresh_token", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 0,
    });

    const user = await prisma.user.findFirst({
      where: { refreshToken: cookies.refresh_token },
    });
    
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null },
      });
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
