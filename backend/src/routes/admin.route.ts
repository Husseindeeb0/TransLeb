import express from "express";
import { verifyJWT, verifyAdmin } from "../middleware";
import {
  updateDriverStatus,
  updateDriverSubscription,
  deleteDriver,
} from "../controllers/admin.controller";

const adminRouter = express.Router();

adminRouter.use(verifyJWT, verifyAdmin);

adminRouter.patch("/drivers/:driverId/status", updateDriverStatus);
adminRouter.patch("/drivers/:driverId/subscription", updateDriverSubscription);
adminRouter.delete("/drivers/:driverId", deleteDriver);

export default adminRouter;
