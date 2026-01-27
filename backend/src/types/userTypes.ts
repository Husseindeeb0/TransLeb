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

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  coordinates?: Types.ObjectId | CoordinatesType;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  coordinates?: Types.ObjectId | CoordinatesType;
}

export interface AuthResponse extends UserResponse {
  message: string;
}
