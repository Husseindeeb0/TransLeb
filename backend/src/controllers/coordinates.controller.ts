import type { Request, Response } from "express";
import Coordinates from "../models/Coordinates";

const addCoordinate = async (req: Request, res: Response) => {
  try {
    const { lat, lng, userId } = req.body;

    if (!lat || !lng) {
      return res.status(500).json({ message: "Coordinates are Required" });
    }

    if (!userId) {
      return res.status(500).json({ message: "User Id is Required" });
    }

    const newCoordinate = new Coordinates({
      userId: userId,
      lat: lat,
      lng: lng,
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
    const { lat, lng, userId} = req.body;
    if (!lat || !lng) {
      return res.status(400).json({ message: "Coordinates are required" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedCoordinate = await Coordinates.findOneAndUpdate(
      { userId: userId },
      {
        userId: userId,
        lat: lat,
        lng: lng,
      },
      { new: true, upsert: true }
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
    const { userId } = req.body;

    if (!userId) {
      return res.status(500).json({ message: "User Id is required" });
    }

    Coordinates.findByIdAndDelete({ userId: userId });

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

export { addCoordinate, editCoordinate, deleteCoordinate };
