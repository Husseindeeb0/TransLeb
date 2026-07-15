import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const updateDriverStatus = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const { active } = req.body;

    if (!driverId) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "Driver ID is required",
      });
    }

    if (active === undefined) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "Active status field is required",
      });
    }

    const driver = await prisma.user.findUnique({
      where: { id: String(driverId) },
    });

    if (!driver || driver.role !== "driver") {
      return res.status(404).json({
        state: "DRIVER_NOT_FOUND",
        message: "Driver not found",
      });
    }

    const updatedDriver = await prisma.user.update({
      where: { id: String(driverId) },
      data: { active: Boolean(active) },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
      },
    });

    return res.status(200).json({
      message: `Driver account status updated to ${updatedDriver.active ? "active" : "inactive"}.`,
      driver: updatedDriver,
    });
  } catch (error) {
    console.error("Update driver status error:", error);
    return res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Failed to update driver status",
    });
  }
};

export const updateDriverSubscription = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const { subscriptionStart, subscriptionEnd } = req.body;

    if (!driverId) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "Driver ID is required",
      });
    }

    const driver = await prisma.user.findUnique({
      where: { id: String(driverId) },
    });

    if (!driver || driver.role !== "driver") {
      return res.status(404).json({
        state: "DRIVER_NOT_FOUND",
        message: "Driver not found",
      });
    }

    const updateData: any = {};
    if (subscriptionStart !== undefined) {
      updateData.subscriptionStart = subscriptionStart ? new Date(subscriptionStart) : null;
    }
    if (subscriptionEnd !== undefined) {
      updateData.subscriptionEnd = subscriptionEnd ? new Date(subscriptionEnd) : null;
    }

    const updatedDriver = await prisma.user.update({
      where: { id: String(driverId) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        subscriptionStart: true,
        subscriptionEnd: true,
      },
    });

    return res.status(200).json({
      message: "Driver subscription dates updated successfully.",
      driver: updatedDriver,
    });
  } catch (error) {
    console.error("Update driver subscription error:", error);
    return res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Failed to update driver subscription details",
    });
  }
};

export const deleteDriver = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;

    if (!driverId) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "Driver ID is required",
      });
    }

    const driver = await prisma.user.findUnique({
      where: { id: String(driverId) },
    });

    if (!driver || driver.role !== "driver") {
      return res.status(404).json({
        state: "DRIVER_NOT_FOUND",
        message: "Driver not found",
      });
    }

    await prisma.user.delete({
      where: { id: String(driverId) },
    });

    return res.status(200).json({
      message: "Driver account deleted successfully",
    });
  } catch (error) {
    console.error("Delete driver error:", error);
    return res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete driver",
    });
  }
};
