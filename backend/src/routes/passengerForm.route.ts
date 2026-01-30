import express from "express";
import { checkAuth } from "../middleware";
import { submitForm, updateForm, deleteForm, getForms, getFormById, isFormExists } from "../controllers/passengerForm.controller";
const router = express.Router();

router.post("/submit", checkAuth, submitForm);
router.put("/update", checkAuth, updateForm);
router.delete("/delete/:formId", checkAuth, deleteForm);
router.get("/getForms/:dayCardId", checkAuth, getForms);
router.get("/getFormById/:formId", checkAuth, getFormById);
router.get("/exists/:dayCardId", checkAuth, isFormExists);

export default router;