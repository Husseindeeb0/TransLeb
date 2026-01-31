import mongoose from "mongoose";
import type { DayCardType } from "../types/dayCardTypes";

const dayCardSchema = new mongoose.Schema<DayCardType>(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: Date, required: true },
    busTimers: {
      type: [
        {
          time: { type: String, required: true },
          capacity: { type: Number, required: true },
        },
      ],
      default: [],
      required: false,
    },
    formState: {
      type: String,
      enum: ["open", "planning", "scheduled", "archived"],
      default: "open",
    },
  },
  { timestamps: true },
);

dayCardSchema.index({ driverId: 1, date: 1 }, { unique: true });

const DayCard = mongoose.model("DayCard", dayCardSchema);
export default DayCard;
