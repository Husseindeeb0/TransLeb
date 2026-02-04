import { Request, Response } from "express";
import DayCard from "../models/DayCard";
import User from "../models/User";
import type {
  DayCardResponse,
  CreateDayCardRequest,
  UpdateDayCardRequest,
} from "../types/dayCardTypes";

export const createDayCard = async (req: Request, res: Response) => {
  try {
    const { driverId, date, busTimers, formState }: CreateDayCardRequest =
      req.body;

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

    const dayCard = await DayCard.create({
      driverId,
      date,
      busTimers: busTimers || [],
      formState: formState || "open",
    });

    const response: DayCardResponse = {
      dayCardId: dayCard._id.toString(),
      driverId: dayCard.driverId,
      date: dayCard.date,
      busTimers: dayCard.busTimers,
      formState: dayCard.formState,
    };

    return res.status(201).json(response);
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
    const dayCardId = req.params.dayCardId || req.body.dayCardId;
    const { date, busTimers, formState }: UpdateDayCardRequest = req.body;

    if (!dayCardId) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "Day Card ID is required",
      });
    }

    const updateData: any = {};
    if (date !== undefined) updateData.date = date;
    if (busTimers !== undefined) updateData.busTimers = busTimers;
    if (formState !== undefined) updateData.formState = formState;

    const dayCard = await DayCard.findByIdAndUpdate(dayCardId, updateData, {
      new: true,
    });

    if (!dayCard) {
      return res.status(404).json({
        state: "RESOURCE_NOT_FOUND",
        message: "Day card not found",
      });
    }

    const response: DayCardResponse = {
      dayCardId: dayCardId,
      driverId: dayCard.driverId,
      date: dayCard.date,
      busTimers: dayCard.busTimers,
      formState: dayCard.formState,
    };

    return res.status(200).json(response);
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
    const { dayCardId } = req.params;

    if (!dayCardId) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "Day Card ID is required",
      });
    }

    const dayCard = await DayCard.findByIdAndDelete(dayCardId);

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

export const getDayCards = async (req: Request, res: Response) => {
  try {
    const driverId = req.params.driverId;

    if (!driverId) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "Driver ID is required",
      });
    }

    const dayCards = await DayCard.find({ driverId: driverId });

    const response: DayCardResponse[] = dayCards.map((card) => ({
      dayCardId: card._id.toString(),
      driverId: card.driverId,
      date: card.date,
      busTimers: card.busTimers,
      formState: card.formState,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Day cards fetch error:", error);
    res.status(500).json({
      message: "Failed to fetch day cards",
    });
  }
};

export const getDayCardById = async (req: Request, res: Response) => {
  try {
    const { dayCardId } = req.params;

    if (!dayCardId) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "Day Card ID is required",
      });
    }

    const dayCard = await DayCard.findById(dayCardId);

    if (!dayCard) {
      return res.status(404).json({
        state: "RESOURCE_NOT_FOUND",
        message: "Day card not found",
      });
    }

    const response: DayCardResponse = {
      dayCardId: dayCard._id.toString(),
      driverId: dayCard.driverId,
      date: dayCard.date,
      busTimers: dayCard.busTimers,
      formState: dayCard.formState,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Day card fetch error:", error);
    return res.status(500).json({
      message: "Failed to fetch day card",
    });
  }
};
