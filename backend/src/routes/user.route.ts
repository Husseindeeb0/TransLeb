import express from "express";
import {
  getUserDetails,
  getMe,
  getAllDrivers,
  updateProfile,
} from "../controllers/user.controller";
import { verifyJWT } from "../middleware";

const userRouter = express.Router();

userRouter.get("/me", verifyJWT, getMe);
userRouter.get("/getDetails/:userId", getUserDetails);
userRouter.get("/getAllDrivers", getAllDrivers);
userRouter.patch("/updateProfile", verifyJWT, updateProfile);

export default userRouter;
