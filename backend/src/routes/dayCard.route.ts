import express from "express";
import {
  createDayCard,
  updateDayCard,
  deleteDayCard,
  getDayCards,
  getDayCardById,
} from "../controllers/dayCard.controller";
import { verifyJWT, verifyActiveDriver } from "../middleware";
const router = express.Router();

router.post("/create", verifyJWT, verifyActiveDriver, createDayCard);
router.patch("/update/:dayCardId", verifyJWT, verifyActiveDriver, updateDayCard);
router.delete("/delete/:dayCardId", verifyJWT, verifyActiveDriver, deleteDayCard);
router.get("/getDayCards", verifyJWT, getDayCards);
router.get("/getDayCardById/:dayCardId", verifyJWT, getDayCardById);

export default router;
