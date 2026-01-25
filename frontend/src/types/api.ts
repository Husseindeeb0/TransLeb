export interface ApiError {
  status?: number;
  data?: {
    state?: string;
    message?: string;
    [key: string]: unknown;
  };
}
