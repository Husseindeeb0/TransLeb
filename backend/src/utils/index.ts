import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { TokenPayload } from "../types";
import { UserType } from "../types/userTypes";
import dotenv from "dotenv";
dotenv.config();

const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};

const generateToken = (user: UserType) => {
  const secret = process.env.ACCESS_SECRET_TOKEN;
  if (!secret) {
    throw new Error(
      "ACCESS_SECRET_TOKEN is not defined in environment variables",
    );
  }

  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn: "1h",
    },
  );
};

const generateRefreshToken = (user: UserType) => {
  const secret = process.env.REFRESH_SECRET_TOKEN;
  if (!secret) {
    throw new Error(
      "REFRESH_SECRET_TOKEN is not defined in environment variables",
    );
  }

  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "7d" },
  );
};

const setTokenCookies = async (
  res: Response,
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

const verifyToken = (
  token: string,
  type: "access" | "refresh" = "access",
): TokenPayload | null => {
  try {
    const secret =
      type === "access"
        ? process.env.ACCESS_SECRET_TOKEN
        : process.env.REFRESH_SECRET_TOKEN;
    if (!secret) {
      throw new Error(
        "ACCESS_SECRET_TOKEN or REFRESH_SECRET_TOKEN is not defined in environment variables",
      );
    }
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    console.error(`Token verification failed (${type}):`, error);
    return null;
  }
};

export {
  hashPassword,
  comparePassword,
  generateToken,
  generateRefreshToken,
  setTokenCookies,
  verifyToken,
};
