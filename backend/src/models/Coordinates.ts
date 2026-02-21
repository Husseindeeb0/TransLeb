import mongoose from "mongoose";
import { CoordinatesType } from "../types";

const coordinatesSchema = new mongoose.Schema<CoordinatesType>(
  {
    userId: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    dayCardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DayCard",
      default: null,
    },
    startTimer: { type: Date, default: null },
    markedBy: { type: String, default: null },
    markedAt: { type: Date, default: null },
    extensionCount: { type: Number, default: 0 },
    duration: { type: Number, default: 15 * 60 * 1000 },
  },
  { timestamps: true },
);

const Coordinates = mongoose.model("Coordinate", coordinatesSchema);
export default Coordinates;
