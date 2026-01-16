import express from "express";
import { getUserDetails } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/getDetails/:userId", getUserDetails);

export default userRouter;
