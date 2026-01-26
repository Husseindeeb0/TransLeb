import { Types } from "mongoose";
import { CoordinatesType } from "./index";

export interface UserType {
  _id: string;
  name: string;
  email: string;
  password: string;
  refreshToken: string;
  role: string;
  coordinates: Types.ObjectId | CoordinatesType;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  name: string;
  email: string;
  password: string;
  role: string;
  coordinates?: Types.ObjectId | CoordinatesType;
}
