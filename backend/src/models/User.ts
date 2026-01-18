import mongoose from "mongoose";
import { UserType } from "../types";

const userSchema = new mongoose.Schema<UserType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    coordinates: { type: mongoose.Schema.Types.ObjectId, ref: "Coordinates"},
    role: { type: String, required: true },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
