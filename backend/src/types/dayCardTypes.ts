import { Types } from "mongoose";
import { UserType } from "./userTypes";

export interface DayCardType {
  _id: string;
  driverId: Types.ObjectId | UserType;
  date: Date;
  busTimers: Array<String>;
  formState: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DayCardResponse {
  driverId: Types.ObjectId | UserType;
  date: Date;
  busTimers?: Array<String>;
  formState?: string;
}