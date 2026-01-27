import { Request, Response } from "express";
import { verifyToken } from "../utils";
import { UserResponse } from "../types/userTypes";

export async function checkAuth(
  req: Request,
  res: Response,
): Promise<Response | void> {
  try {
    // Extract access token from cookies (must match name in setTokenCookies)
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return res.status(401).json({
        state: "AUTH_REQUIRED",
        message: "Authentication required",
      });
    }

    // Verify token
    const decoded = verifyToken(accessToken, "access");

    if (
      !decoded ||
      !("id" in decoded) ||
      !("email" in decoded) ||
      !("role" in decoded)
    ) {
      return res.status(401).json({
        state: "INVALID_TOKEN",
        message: "Invalid or expired token",
      });
    }

    // Return user data from token in UserResponse format
    const response: UserResponse = {
      _id: decoded.id as string,
      email: decoded.email as string,
      role: decoded.role as string,
      name: decoded.name as string,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      state: "AUTH_FAILED",
      message: "Authentication failed",
    });
  }
}
