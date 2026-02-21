import express from "express";
import {
  createDayCard,
  updateDayCard,
  deleteDayCard,
  getDayCards,
  getDayCardById,
} from "../controllers/dayCard.controller";
import { verifyJWT } from "../middleware";
const router = express.Router();

router.post("/create", verifyJWT, createDayCard);
router.patch("/update/:dayCardId", verifyJWT, updateDayCard);
router.delete("/delete/:dayCardId", verifyJWT, deleteDayCard);
router.get("/getDayCards", verifyJWT, getDayCards);
router.get("/getDayCardById/:dayCardId", verifyJWT, getDayCardById);

export default router;
