import { DayCardType } from "./dayCardTypes";

export interface PassengerFormType {
  id: string;
  dayCardId: string | DayCardType;
  userId: string;
  fullName: string;
  phoneNumber: string;
  livingPlace: string;
  desiredTime: string;
  passengerCount: number;
  assignedBusTime?: string;
}

export interface SubmitRequestType {
  dayCardId: string;
  fullName: string;
  phoneNumber: string;
  livingPlace: string;
  desiredTime: string;
  passengerCount: number;
}

export interface UpdateRequestType {
  formId: string;
  fullName?: string;
  phoneNumber?: string;
  livingPlace?: string;
  desiredTime?: string;
  passengerCount?: number;
  assignedBusTime?: string;
}
