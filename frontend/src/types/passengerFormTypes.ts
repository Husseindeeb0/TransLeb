export interface PassengerForm {
    _id?: string;
    formId?: string;
    dayCardId: string;
    fullName: string;
    phoneNumber: string;
    livingPlace: string;
    desiredTime: string;
    passengerCount: number;
    assignedBusTime?: string | null;
    userId?: string | { _id: string; name?: string };
}

export interface SubmitPassengerFormRequest {
    dayCardId: string;
    fullName: string;
    phoneNumber: string;
    livingPlace: string;
    desiredTime: string;
    passengerCount: number;
}

export interface UpdatePassengerFormRequest {
    formId: string;
    dayCardId?: string;
    fullName?: string;
    phoneNumber?: string;
    livingPlace?: string;
    desiredTime?: string;
    passengerCount?: number;
    assignedBusTime?: string | null;
}

export interface IsFormExistsResponse {
    exists: boolean;
    data: PassengerForm | string | null;
}