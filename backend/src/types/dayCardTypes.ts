import { Types } from "mongoose";
import { UserType } from "./userTypes";

export interface DayCardType {
  _id: string;
  driverId: Types.ObjectId | UserType;
  date: Date;
  busTimers: string[];
  formState: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DayCardResponse {
  dayCardId: string;
  driverId: Types.ObjectId | UserType;
  date: Date;
  busTimers: string[];
  formState: string;
}

export interface CreateDayCardRequest {
  driverId: string;
  date: string;
  busTimers?: string[];
  formState?: string;
};

export interface UpdateDayCardRequest {
  dayCardId: string;
  date?: string;
  busTimers?: string[];
  formState?: string;
};
