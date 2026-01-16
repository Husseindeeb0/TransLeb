import type { Request, Response } from "express";
import Coordinates from "../models/Coordinates";
import e from "express";

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
    const { lat, lng, userId } = req.body;
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

    const deleted = await Coordinates.findOneAndDelete({ userId });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Coordinates not found or already deleted" });
    }

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
    const { userId } = req.params;
    if (!userId) {
      return res.status(500).json({ message: "User Id is required" });
    }

    const coordinate = await Coordinates.findOne({ userId: userId });
    if (!coordinate) {
      return res.status(404).json({ message: "Coordinates not found" });
    }
    res.status(200).json({ message: "Coordinates found", data: coordinate });
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
    // get all coordinates that are not expired (logic handled by delete)
    // and maybe filter by status if we only want available ones?
    // For driver map, we probably want ALL, but maybe distinguish them.
    const coordinates = await Coordinates.find({});
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
