import { Types } from "mongoose";
import { DayCardType } from "./dayCardTypes";

export interface PassengerFormType {
  _id: string;
  dayCardId: Types.ObjectId | DayCardType;
  fullName: string;
  phoneNumber: string;
  livingPlace: string;
  desiredTime: string;
  passengerCount: number;
}