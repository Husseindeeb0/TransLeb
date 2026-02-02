import mongoose from "mongoose";
import type { UserType } from "../types/userTypes";

const userSchema = new mongoose.Schema<UserType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    coordinates: { type: mongoose.Schema.Types.ObjectId, ref: "Coordinates" },

    role: {
      type: String,
      enum: ["driver", "passenger"],
      default: "passenger",
      required: true,
    },
    refreshToken: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    region: { type: String, default: null },
    description: { type: String, default: null },
    profileImage: { type: String, default: null },
    coverImage: { type: String, default: null },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
