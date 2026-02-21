import { UserResponse } from "./userTypes";

declare global {
  namespace Express {
    interface Request {
      user?: UserResponse;
      userId?: string;
    }
  }
}
