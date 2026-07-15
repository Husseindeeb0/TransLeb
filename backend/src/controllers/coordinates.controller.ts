import type { Request, Response } from "express";
import { prisma } from "../config/prisma";

const addCoordinate = async (req: Request, res: Response) => {
  try {
    const { lat, lng, dayCardId } = req.body;
    const userId = req.userId;

    if (lat === undefined || lng === undefined) {
      return res.status(500).json({ message: "Coordinates are Required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const newCoordinate = await prisma.coordinates.create({
      data: {
        userId: userId,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        dayCardId: dayCardId || null,
      },
    });

    res.status(201).json({ message: "Coordinates Saved", data: newCoordinate });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in add coordinate controller: ", error.message);
    } else {
      console.log("Unknown error in add coordinate controller", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editCoordinate = async (req: Request, res: Response) => {
  try {
    const { lat, lng, dayCardId } = req.body;
    const userId = req.userId;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "Coordinates are required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const updatedCoordinate = await prisma.coordinates.upsert({
      where: { userId: userId },
      update: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        dayCardId: dayCardId || null,
      },
      create: {
        userId: userId,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        dayCardId: dayCardId || null,
      },
    });

    res
      .status(200)
      .json({ message: "Coordinates saved", data: updatedCoordinate });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in edit coordinate controller:", error.message);
    } else {
      console.error("Unknown error in edit coordinate controller", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteCoordinate = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    await prisma.coordinates
      .delete({
        where: { userId: userId },
      })
      .catch(() => {
        // Ignore if not exists
      });

    res.status(200).json({ message: "Coordinates deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in delete coordinate controller:", error.message);
    } else {
      console.error("Unknown error in delete coordinate controller", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCoordinates = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const coordinate = await prisma.coordinates.findUnique({
      where: { userId: userId },
    });

    res.status(200).json({
      message: "Coordinate search completed",
      data: coordinate,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in get coordinate controller:", error.message);
    } else {
      console.error("Unknown error in get coordinate controller", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllCoordinates = async (req: Request, res: Response) => {
  try {
    const { dayCardId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    if (!dayCardId) {
      return res.status(400).json({ message: "Day card ID is required" });
    }

    const coordinates = await prisma.coordinates.findMany({
      where: { userId: userId, dayCardId: dayCardId },
    });

    res.status(200).json({ message: "Coordinates found", data: coordinates });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in get all coordinates controller:", error.message);
    } else {
      console.error("Unknown error in get all coordinates controller", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  addCoordinate,
  editCoordinate,
  deleteCoordinate,
  getCoordinates,
  getAllCoordinates,
};
