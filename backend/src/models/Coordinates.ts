import mongoose from "mongoose";

export interface CoordinatesType {
  lat: number;
  lng: number;
}

const coordinatesSchema = new mongoose.Schema<CoordinatesType>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { timestamps: true }
);

const Coordinates = mongoose.model("Coordinate", coordinatesSchema);
export default Coordinates;
