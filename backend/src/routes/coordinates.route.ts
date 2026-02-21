import express from "express";
import {
  addCoordinate,
  deleteCoordinate,
  editCoordinate,
  getCoordinates,
  getAllCoordinates,
} from "../controllers/coordinates.controller";
import { verifyJWT } from "../middleware";
const coordinatesRouter = express.Router();

coordinatesRouter.post("/addCoordinate", verifyJWT, addCoordinate);
coordinatesRouter.patch("/editCoordinate", verifyJWT, editCoordinate);
coordinatesRouter.delete("/deleteCoordinate", verifyJWT, deleteCoordinate);
coordinatesRouter.get("/getCoordinates", verifyJWT, getCoordinates);
coordinatesRouter.get("/getAllCoordinates/:dayCardId", verifyJWT, getAllCoordinates);

export default coordinatesRouter;
