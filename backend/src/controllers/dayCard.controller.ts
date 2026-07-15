import { Request, Response } from "express";
import { prisma } from "../config/prisma";
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

    const user = await prisma.user.findUnique({ where: { id: driverId } });
    if (!user) {
      return res.status(404).json({
        state: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const dayCard = await prisma.dayCard.create({
      data: {
        driverId,
        date: new Date(date),
        formState: (formState || "open") as any,
        busTimers: {
          create: (busTimers || []).map((timer) => ({
            time: timer.time,
            capacity: parseInt(timer.capacity as any),
          })),
        },
      },
      include: {
        busTimers: true,
      },
    });

    const response: DayCardResponse = {
      dayCardId: dayCard.id,
      driverId: dayCard.driverId,
      date: dayCard.date,
      busTimers: dayCard.busTimers.map(timer => ({
        time: timer.time,
        capacity: timer.capacity
      })),
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
    if (date !== undefined) updateData.date = new Date(date);
    if (formState !== undefined) updateData.formState = formState as any;
    
    if (busTimers !== undefined) {
      updateData.busTimers = {
        deleteMany: {},
        create: busTimers.map((timer) => ({
          time: timer.time,
          capacity: parseInt(timer.capacity as any),
        })),
      };
    }

    const dayCard = await prisma.dayCard.update({
      where: { id: dayCardId },
      data: updateData,
      include: {
        busTimers: true,
      },
    });

    if (!dayCard) {
      return res.status(404).json({
        state: "RESOURCE_NOT_FOUND",
        message: "Day card not found",
      });
    }

    const response: DayCardResponse = {
      dayCardId: dayCard.id,
      driverId: dayCard.driverId,
      date: dayCard.date,
      busTimers: dayCard.busTimers.map(timer => ({
        time: timer.time,
        capacity: timer.capacity
      })),
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

    const dayCard = await prisma.dayCard.delete({
      where: { id: dayCardId },
    });

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
    const driverId = req.userId;

    if (!driverId) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "Driver ID is required",
      });
    }

    const dayCards = await prisma.dayCard.findMany({
      where: { driverId: driverId },
      include: {
        busTimers: true,
      },
    });

    const response: DayCardResponse[] = dayCards.map((card) => ({
      dayCardId: card.id,
      driverId: card.driverId,
      date: card.date,
      busTimers: card.busTimers.map(timer => ({
        time: timer.time,
        capacity: timer.capacity
      })),
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

    const dayCard = await prisma.dayCard.findUnique({
      where: { id: dayCardId },
      include: {
        busTimers: true,
      },
    });

    if (!dayCard) {
      return res.status(404).json({
        state: "RESOURCE_NOT_FOUND",
        message: "Day card not found",
      });
    }

    const response: DayCardResponse = {
      dayCardId: dayCard.id,
      driverId: dayCard.driverId,
      date: dayCard.date,
      busTimers: dayCard.busTimers.map(timer => ({
        time: timer.time,
        capacity: timer.capacity
      })),
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
