import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import imagekit from "../config/imagekit";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phoneNumber: true,
  region: true,
  description: true,
  profileImage: true,
  profileImageId: true,
  coverImage: true,
  coverImageId: true,
  active: true,
  subscriptionStart: true,
  subscriptionEnd: true,
  createdAt: true,
  updatedAt: true,
};

const getMe = async (req: Request, res: Response) => {
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
      select: userSelect,
    });

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

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
    const drivers = await prisma.user.findMany({
      where: {  role: "driver" },
      select: userSelect,
    });
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
    const id = req.userId;
    const {
      name,
      email,
      phoneNumber,
      region,
      description,
      profileImage,
      coverImage,
    } = req.body;

    if (!id) {
      return res.status(401).json({
        state: "AUTH_REQUIRED",
        message: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        state: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (region !== undefined) updateData.region = region;
    if (description !== undefined) updateData.description = description;

    // Handle Image Uploads with ImageKit
    if (profileImage && profileImage.startsWith("data:image")) {
      try {
        const uploadResponse = await imagekit.upload({
          file: profileImage,
          fileName: `profile_${id}_${Date.now()}`,
          folder: "/profiles",
        });

        if (user.profileImageId) {
          await imagekit
            .deleteFile(user.profileImageId)
            .catch((err) =>
              console.error("Error deleting old profile image:", err),
            );
        }

        updateData.profileImage = uploadResponse.url;
        updateData.profileImageId = uploadResponse.fileId;
      } catch (uploadError: any) {
        console.error(
          "Profile image upload failed:",
          uploadError.message || uploadError,
        );
      }
    } else if (profileImage !== undefined) {
      updateData.profileImage = profileImage;
    }

    if (coverImage && coverImage.startsWith("data:image")) {
      try {
        const uploadResponse = await imagekit.upload({
          file: coverImage,
          fileName: `cover_${id}_${Date.now()}`,
          folder: "/covers",
        });

        if (user.coverImageId) {
          await imagekit
            .deleteFile(user.coverImageId)
            .catch((err) =>
              console.error("Error deleting old cover image:", err),
            );
        }

        updateData.coverImage = uploadResponse.url;
        updateData.coverImageId = uploadResponse.fileId;
      } catch (uploadError: any) {
        console.error(
          "Cover image upload failed:",
          uploadError.message || uploadError,
        );
      }
    } else if (coverImage !== undefined) {
      updateData.coverImage = coverImage;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        region: updatedUser.region,
        description: updatedUser.description,
        profileImage: updatedUser.profileImage,
        coverImage: updatedUser.coverImage,
        role: updatedUser.role,
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
