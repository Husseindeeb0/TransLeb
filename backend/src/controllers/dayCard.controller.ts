import { Request, Response } from "express";
import DayCard from "../models/DayCard";
import User from "../models/User";
import type { DayCardResponse } from "../types/dayCardTypes";

export const createDayCard = async (req: Request, res: Response) => {
  try {
    const { driverId, date, busTimers, formState } = req.body;

    if (!driverId || !date) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "Driver ID and date are required",
      });
    }

    const user = await User.findById(driverId);
    if (!user) {
      return res.status(404).json({
        state: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const dayCardData: DayCardResponse = { driverId, date };
    if (busTimers) dayCardData.busTimers = busTimers;
    if (formState) dayCardData.formState = formState;

    const dayCard = await DayCard.create(dayCardData);
    return res.status(201).json(dayCard);
  } catch (error) {
    console.error("Create DayCard error:", error);
    return res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Failed to create day card",
    });
  }
};

export const updateDayCard = async (req: Request, res: Response) => {
  try {
    const { driverId, date, busTimers, formState } = req.body;

    if (!driverId || !date) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "Driver ID and date are required",
      });
    }

    const user = await User.findById(driverId);
    if (!user) {
      return res.status(404).json({
        state: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const updateData: DayCardResponse = {driverId, date};
    if (busTimers !== undefined) updateData.busTimers = busTimers;
    if (formState !== undefined) updateData.formState = formState;

    const dayCard = await DayCard.findOneAndUpdate(
      { driverId, date },
      updateData,
      { new: true },
    );

    if (!dayCard) {
      return res.status(404).json({
        state: "RESOURCE_NOT_FOUND",
        message: "Day card not found",
      });
    }

    return res.status(200).json(dayCard);
  } catch (error) {
    console.error("Update DayCard error:", error);
    return res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Failed to update day card",
    });
  }
};

export const deleteDayCard = async (req: Request, res: Response) => {
  try {
    const { driverId, date } = req.body;

    if (!driverId || !date) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "Driver ID and date are required",
      });
    }

    const user = await User.findById(driverId);
    if (!user) {
      return res.status(404).json({
        state: "USER_NOT_FOUND",
        message: "User not found",
      });
    }
    const dayCard = await DayCard.findOneAndDelete({ driverId, date });

    if (!dayCard) {
      return res.status(404).json({
        state: "RESOURCE_NOT_FOUND",
        message: "Day card not found",
      });
    }

    return res.status(200).json({ message: "Day card deleted successfully" });
  } catch (error) {
    console.error("Delete DayCard error:", error);
    return res.status(500).json({
      state: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete day card",
    });
  }
};
