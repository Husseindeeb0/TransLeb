import { Types } from "mongoose";
import { UserType } from "./userTypes";

export interface BusSchedule {
  time: string;
  capacity: number;
}

export interface DayCardType {
  _id: string;
  driverId: Types.ObjectId | UserType;
  date: Date | string;
  busTimers: BusSchedule[];
  formState: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DayCardResponse {
  dayCardId: string;
  driverId: Types.ObjectId | UserType;
  date: Date | string;
  busTimers: BusSchedule[];
  formState: string;
}

export interface CreateDayCardRequest {
  driverId: string;
  date: Date | string;
  busTimers?: BusSchedule[];
  formState?: string;
}

export interface UpdateDayCardRequest {
  dayCardId: string;
  date?: Date | string;
  busTimers?: BusSchedule[];
  formState?: string;
}
