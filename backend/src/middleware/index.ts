import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils";

export async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return res.status(401).json({
        state: "AUTH_REQUIRED",
        message: "Authentication required",
      });
    }

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

    req.userId = decoded.id as string;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      state: "AUTH_FAILED",
      message: "Authentication failed",
    });
  }
}
