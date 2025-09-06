import express from "express";
import {
  addCoordinate,
  editCoordinate,
  deleteCoordinate,
} from "../controllers/coordinates.controller.js";

const router = express.Router();

router.post("/addCoordinate", addCoordinate);
router.patch("/editCoordinate", editCoordinate);
router.delete("/deleteCoordinate", deleteCoordinate);
