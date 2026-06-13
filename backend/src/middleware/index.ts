import { Request, Response, NextFunction } from "express";
import {
  verifyToken,
  generateToken,
  generateRefreshToken,
  setTokenCookies,
} from "../utils";
import User from "../models/User";

export async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    let accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({
        state: "AUTH_REQUIRED",
        message: "Authentication required",
      });
    }

    let decoded = accessToken ? verifyToken(accessToken, "access") : null;

    if (!decoded && refreshToken) {
      const refreshDecoded = verifyToken(refreshToken, "refresh");

      if (refreshDecoded) {
        const user = await User.findById(refreshDecoded.id);

        if (user && user.refreshToken === refreshToken) {
          const newAccessToken = generateToken(user);
          // Refresh token is generated every time to prevent reuse (security measure) this is called Refresh Token Rotation
          const newRefreshToken = generateRefreshToken(user);

          setTokenCookies(res, newAccessToken, newRefreshToken);
          user.refreshToken = newRefreshToken;
          await user.save();

          accessToken = newAccessToken;
          decoded = verifyToken(accessToken, "access");
        }
      }
    }

    if (
      !decoded ||
      !("id" in decoded) ||
      !("email" in decoded) ||
      !("role" in decoded)
    ) {
      return res.status(401).json({
        state: "INVALID_TOKEN",
        message: "Invalid or expired session",
      });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      state: "AUTH_FAILED",
      message: "Authentication failed",
    });
  }
}
