import mongoose from "mongoose";

export interface CoordinatesType {
  userId: { type: String };
  lat: number;
  lng: number;
}

const coordinatesSchema = new mongoose.Schema<CoordinatesType>(
  {
    userId: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { timestamps: true }
);

const Coordinates = mongoose.model("Coordinate", coordinatesSchema);
export default Coordinates;
