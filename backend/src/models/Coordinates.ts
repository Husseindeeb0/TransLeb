import mongoose from "mongoose";

export interface CoordinatesType {
  userId: { type: String };
  lat: number;
  lng: number;
  startTimer: Date;
  markedBy?: string | null;
  markedAt?: Date;
  extensionCount: number;
  duration: number;
}

const coordinatesSchema = new mongoose.Schema<CoordinatesType>(
  {
    userId: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    startTimer: { type: Date, default: null },
    markedBy: { type: String, default: null },
    markedAt: { type: Date, default: null },
    extensionCount: { type: Number, default: 0 },
    duration: { type: Number, default: 15 * 60 * 1000 },
  },
  { timestamps: true }
);

const Coordinates = mongoose.model("Coordinate", coordinatesSchema);
export default Coordinates;
