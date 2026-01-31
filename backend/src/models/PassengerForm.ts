import mongoose from "mongoose";
import type { PassengerFormType } from "../types/passengerFormTypes";

const passengerSubmissionSchema = new mongoose.Schema<PassengerFormType>(
  {
    dayCardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DayCard",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fullName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true },
    livingPlace: { type: String, required: true, index: true },
    desiredTime: { type: String, required: true },
    passengerCount: { type: Number, default: 1 },
    assignedBusTime: { type: String, default: null },
  },
  { timestamps: true },
);

// Index for statistics
passengerSubmissionSchema.index({ dayCardId: 1, desiredTime: 1 });

const PassengerForm = mongoose.model(
  "PassengerForm",
  passengerSubmissionSchema,
);

export default PassengerForm;
