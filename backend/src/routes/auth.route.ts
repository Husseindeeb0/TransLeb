import express from "express";
import {
  signup,
  signin,
  logout,
} from "../controllers/auth.controller";
import { verifyJWT } from "../middleware";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", signin);
router.post("/logout", verifyJWT, logout);

export default router;
