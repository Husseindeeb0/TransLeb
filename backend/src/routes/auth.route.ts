import express from "express";
import { signup, signin, logout } from "../controllers/auth.controller";
import { checkAuth } from "../middleware";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", signin);
router.post("/logout", checkAuth, logout);

export default router;
