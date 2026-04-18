import express from "express";
import {
  login,
  signup,
  logout,
} from "../controller/user.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import {
  validateLoginInput,
  validateSignupInput,
} from "../middleware/authValidation.middleware.js";
const router = express.Router();


router.post("/signup", validateSignupInput, signup);
router.post("/login", validateLoginInput, login);
router.post("/logout", authenticate, logout);

export default router;
