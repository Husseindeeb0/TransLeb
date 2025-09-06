import type { Request, Response } from "express";
import Coordinates from "../models/Coordinates.js";

const addCoordinate = async (req: Request, res: Response) => {
  try {
    const { coordinate } = req.body;

    if (!coordinate.lan || !coordinate.lng) {
      return res.status(500).json({ message: "Coordinates are Required" });
    }

    const newCoordinate = new Coordinates({
      lan: coordinate.lan,
      lng: coordinate.lng,
    });

    await newCoordinate.save();
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
  } catch (error) {}
};

const deleteCoordinate = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

export { addCoordinate, editCoordinate, deleteCoordinate };
