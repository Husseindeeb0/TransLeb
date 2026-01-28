export interface DayCard {
    dayCardId: string;
    driverId: string;
    date: Date | string;
    busTimers: string[];
    formState: string;
}

export interface DayCardFormData {
    dayCardId?: string;
    date: Date | string;
    busTimers: string[];
    formState: string;
}

export interface CreateDayCardRequest {
    driverId: string;
    date: Date;
    busTimers: string[];
    formState: string;
}

export interface UpdateDayCardRequest {
  dayCardId: string;
  date?: Date | string;
  busTimers?: string[];
  formState?: string;
};