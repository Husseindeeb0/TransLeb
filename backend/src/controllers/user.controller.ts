import type { Request, Response } from "express";
import User from "../models/User";
import imagekit from "../config/imagekit";

const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        state: "AUTH_REQUIRED",
        message: "Authentication required",
      });
    }

    // Fetch fresh user data from the database
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        state: "USER_NOT_FOUND",
        message: "User not found",
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

const updateProfile = async (req: Request, res: Response) => {
  try {
    const _id = req.user?._id;
    const {
      name,
      email,
      phoneNumber,
      region,
      description,
      profileImage,
      coverImage,
    } = req.body;

    if (!_id) {
      return res.status(401).json({
        state: "AUTH_REQUIRED",
        message: "Authentication required",
      });
    }

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({
        state: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (region !== undefined) user.region = region;
    if (description !== undefined) user.description = description;

    // Handle Image Uploads with ImageKit
    if (profileImage && profileImage.startsWith("data:image")) {
      try {
        const uploadResponse = await imagekit.upload({
          file: profileImage,
          fileName: `profile_${_id}_${Date.now()}`,
          folder: "/profiles",
        });

        if (user.profileImageId) {
          await imagekit
            .deleteFile(user.profileImageId)
            .catch((err) =>
              console.error("Error deleting old profile image:", err),
            );
        }

        user.profileImage = uploadResponse.url;
        user.profileImageId = uploadResponse.fileId;
      } catch (uploadError: any) {
        console.error(
          "Profile image upload failed:",
          uploadError.message || uploadError,
        );
      }
    } else if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    if (coverImage && coverImage.startsWith("data:image")) {
      try {
        const uploadResponse = await imagekit.upload({
          file: coverImage,
          fileName: `cover_${_id}_${Date.now()}`,
          folder: "/covers",
        });

        if (user.coverImageId) {
          await imagekit
            .deleteFile(user.coverImageId)
            .catch((err) =>
              console.error("Error deleting old cover image:", err),
            );
        }

        user.coverImage = uploadResponse.url;
        user.coverImageId = uploadResponse.fileId;
      } catch (uploadError: any) {
        console.error(
          "Cover image upload failed:",
          uploadError.message || uploadError,
        );
      }
    } else if (coverImage !== undefined) {
      user.coverImage = coverImage;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        region: user.region,
        description: user.description,
        profileImage: user.profileImage,
        coverImage: user.coverImage,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error(
      "Error in update profile controller:",
      error.message || error,
    );
    res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
};

export { getUserDetails, getMe, getAllDrivers, updateProfile };
