import express from "express";
import {
  addCoordinate,
  editCoordinate,
  deleteCoordinate,
  getCoordinates
} from "../controllers/coordinates.controller";

const router = express.Router();

router.post("/addCoordinate", addCoordinate);
router.patch("/editCoordinate", editCoordinate);
router.delete("/deleteCoordinate", deleteCoordinate);
router.get("/getCoordinates/:userId", getCoordinates);

export default router;