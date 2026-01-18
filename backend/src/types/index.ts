import { Types } from "mongoose";

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

export interface TokenPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  iat?: number; // issued at (added by JWT)
  exp?: number; // expiration time (added by JWT)
}
