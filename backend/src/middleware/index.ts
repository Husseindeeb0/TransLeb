import { Request, Response, NextFunction } from "express";
import {
  verifyToken,
  generateToken,
  generateRefreshToken,
  setTokenCookies,
} from "../utils";
import { prisma } from "../config/prisma";

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
        const user = await prisma.user.findUnique({
          where: { id: refreshDecoded.id },
        });

        if (user && user.refreshToken === refreshToken) {
          const userPayload = {
            ...user,
            coordinates: user.id, // simplified payload match
          } as any;

          const newAccessToken = generateToken(userPayload);
          // Refresh token is generated every time to prevent reuse (security measure) this is called Refresh Token Rotation
          const newRefreshToken = generateRefreshToken(userPayload);

          setTokenCookies(res, newAccessToken, newRefreshToken);
          await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
          });

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

export async function verifyAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        state: "AUTH_REQUIRED",
        message: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        state: "FORBIDDEN",
        message: "Access denied. Admin role required.",
      });
    }

    next();
  } catch (error) {
    console.error("VerifyAdmin middleware error:", error);
    return res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Internal server error during authorization check",
    });
  }
}

export async function verifyActiveDriver(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        state: "AUTH_REQUIRED",
        message: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || (user.role !== "driver" && user.role !== "admin")) {
      return res.status(403).json({
        state: "FORBIDDEN",
        message: "Access denied. Only drivers can access this resource.",
      });
    }

    if (!user.active && user.role !== "admin") {
      return res.status(403).json({
        state: "DRIVER_INACTIVE",
        message:
          "Your driver account is inactive. Please contact administration.",
      });
    }

    const now = new Date();
    if (
      user.subscriptionEnd &&
      now > user.subscriptionEnd &&
      user.role !== "admin"
    ) {
      return res.status(403).json({
        state: "SUBSCRIPTION_EXPIRED",
        message:
          "Your driver subscription has expired. Please contact administration.",
      });
    }

    next();
  } catch (error) {
    console.error("VerifyActiveDriver middleware error:", error);
    return res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Internal server error during authorization check",
    });
  }
}
