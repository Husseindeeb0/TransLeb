import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils";

export async function authMiddleware(
  req: Request,
  res: Response,
): Promise<Response | void> {
  try {
    // Extract access token from cookies
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify token
    const decoded = verifyToken(accessToken, "access");

    // Check that decoded token has all required fields
    if (
      !decoded ||
      !("userId" in decoded) ||
      !("email" in decoded) ||
      !("role" in decoded)
    ) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Return user data from token (TypeScript now knows decoded has all required fields)
    return res.status(200).json({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
}
