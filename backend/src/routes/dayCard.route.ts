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
router.put("/update", checkAuth, updateDayCard);
router.delete("/delete", checkAuth, deleteDayCard);
router.get("/getDayCards", checkAuth, getDayCards);
router.get("/getDayCardById/:dayCardId", checkAuth, getDayCardById);

export default router;
