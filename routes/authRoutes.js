import express from "express";
import { registerUser, loginUser, getMe, updateUserProfile } from "../controllers/authController.js";
import cookieParser from "cookie-parser";

const router = express.Router();

// parse cookies
router.use(cookieParser());

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getMe); // get current user from cookie
router.put("/profile/:email", updateUserProfile);

export default router;
