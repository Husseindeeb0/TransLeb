import type { Request, Response } from "express";
import User from "../models/User";

const getMe = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        state: "AUTH_REQUIRED",
        message: "Authentication required",
      });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
  }
};

const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        state: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in get user details controller", error);
    res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
};

const getAllDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await User.find({ role: "driver" }).select(
      "-password -refreshToken",
    );
    return res.status(200).json(drivers);
  } catch (error) {
    console.error("GetAllDrivers error:", error);
    return res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
  }
};

export { getUserDetails, getMe, getAllDrivers };
