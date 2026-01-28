import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils";
import { UserResponse } from "../types/userTypes";

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction,
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
    const userData: UserResponse = {
      _id: decoded.id as string,
      email: decoded.email as string,
      role: decoded.role as string,
      name: decoded.name as string,
    };

    // Attach user to request object
    (req as any).user = userData;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      state: "AUTH_FAILED",
      message: "Authentication failed",
    });
  }
}
