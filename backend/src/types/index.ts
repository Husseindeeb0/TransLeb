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

export interface TokenPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
