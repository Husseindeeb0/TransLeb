import express from "express";
import {
  addCoordinate,
  deleteCoordinate,
  editCoordinate,
  getCoordinates,
  getAllCoordinates,
} from "../controllers/coordinates.controller";

const coordinatesRouter = express.Router();

coordinatesRouter.post("/addCoordinate", addCoordinate);
coordinatesRouter.patch("/editCoordinate", editCoordinate);
coordinatesRouter.delete("/deleteCoordinate", deleteCoordinate);
coordinatesRouter.get("/getCoordinates/:userId", getCoordinates);
coordinatesRouter.get("/getAllCoordinates", getAllCoordinates);

export default coordinatesRouter;
