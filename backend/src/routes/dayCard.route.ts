import express from "express";
import {
  createDayCard,
  updateDayCard,
  deleteDayCard,
  getDayCards,
  getDayCardById,
} from "../controllers/dayCard.controller";
import { checkAuth } from "../middleware";
const router = express.Router();

router.post("/create", checkAuth, createDayCard);
router.patch("/update/:dayCardId", checkAuth, updateDayCard);
router.delete("/delete/:dayCardId", checkAuth, deleteDayCard);
router.get("/getDayCards/:driverId", checkAuth, getDayCards);
router.get("/getDayCardById/:dayCardId", checkAuth, getDayCardById);

export default router;
