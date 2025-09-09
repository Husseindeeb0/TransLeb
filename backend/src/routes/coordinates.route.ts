import express from "express";
import {
  addCoordinate,
  editCoordinate,
  deleteCoordinate,
} from "../controllers/coordinates.controller";

const router = express.Router();

router.post("/addCoordinate", addCoordinate);
router.patch("/editCoordinate", editCoordinate);
router.delete("/deleteCoordinate", deleteCoordinate);

export default router;