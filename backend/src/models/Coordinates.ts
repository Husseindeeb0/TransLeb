import mongoose from "mongoose";

export interface CoordinatesType {
  userId: { type: String };
  lat: number;
  lng: number;
  startTimer: Date;
}

const coordinatesSchema = new mongoose.Schema<CoordinatesType>(
  {
    userId: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    startTimer: { type: Date, default: null },
  },
  { timestamps: true }
);

const Coordinates = mongoose.model("Coordinate", coordinatesSchema);
export default Coordinates;
