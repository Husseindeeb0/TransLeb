import express from "express";
import {
  getUserDetails,
  getMe,
  getAllDrivers,
  updateProfile,
} from "../controllers/user.controller";
import { checkAuth } from "../middleware";

const userRouter = express.Router();

userRouter.get("/me", checkAuth, getMe);
userRouter.get("/getDetails/:userId", getUserDetails);
userRouter.get("/getAllDrivers", getAllDrivers);
userRouter.patch("/updateProfile", checkAuth, updateProfile);

export default userRouter;
