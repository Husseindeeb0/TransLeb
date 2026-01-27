import express from "express";
import { checkAuth } from "../middleware";
import { submitForm, updateForm, deleteForm, getForms, getFormById } from "../controllers/passengerForm.controller";
const router = express.Router();

router.post("/submit", checkAuth, submitForm);
router.put("/update", checkAuth, updateForm);
router.delete("/delete", checkAuth, deleteForm);
router.get("/getForms", checkAuth, getForms);
router.get("/getFormById/:formId", checkAuth, getFormById);

export default router;