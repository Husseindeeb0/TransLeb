import express from "express";
import { verifyJWT } from "../middleware";
import {
  submitForm,
  updateForm,
  deleteForm,
  getForms,
  getFormById,
  isFormExists,
} from "../controllers/passengerForm.controller";
const router = express.Router();

router.post("/submit", verifyJWT, submitForm);
router.put("/update", verifyJWT, updateForm);
router.delete("/delete/:formId", verifyJWT, deleteForm);
router.get("/getForms/:dayCardId", verifyJWT, getForms);
router.get("/getFormById/:formId", verifyJWT, getFormById);
router.get("/exists/:dayCardId", verifyJWT, isFormExists);

export default router;
