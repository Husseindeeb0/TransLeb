export interface CoordinatesType {
  userId: string;
  lat: number;
  lng: number;
  dayCardId?: string;
  startTimer: Date;
  markedBy?: string | null;
  markedAt?: Date;
  extensionCount: number;
  duration: number;
}

export interface TokenPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
