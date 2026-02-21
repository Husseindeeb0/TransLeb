import type { Request, Response } from "express";
import Coordinates from "../models/Coordinates";

const addCoordinate = async (req: Request, res: Response) => {
  try {
    const { lat, lng, dayCardId } = req.body;
    const userId = req.userId;

    if (!lat || !lng) {
      return res.status(500).json({ message: "Coordinates are Required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const newCoordinate = new Coordinates({
      userId: userId,
      lat: lat,
      lng: lng,
      dayCardId: dayCardId || null,
    });

    await newCoordinate.save();
    res.status(201).json({ message: "Coordinates Saved" });
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

    if (!lat || !lng) {
      return res.status(400).json({ message: "Coordinates are required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const updatedCoordinate = await Coordinates.findOneAndUpdate(
      { userId: userId },
      {
        userId: userId,
        lat: lat,
        lng: lng,
        dayCardId: dayCardId || null,
      },
      { new: true, upsert: true },
    );

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

    await Coordinates.findOneAndDelete({ userId });

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

    const coordinate = await Coordinates.findOne({ userId: userId });
    res.status(200).json({
      message: "Coordinate search completed",
      data: coordinate || null,
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

    const coordinates = await Coordinates.find({ userId: userId, dayCardId: dayCardId });
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
