import express from "express";
import {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  logout,
  resetPassword,
  getUserProfile,
  handleRefreshToken,
} from "../controllers/authController.js";
// import { handleRefreshToken } from "../utils/generateJWTToken.js";
import verifyJwt from "../middelware/verifyJWT.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email/", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", verifyJwt, getUserProfile); // Assuming you have a middleware to authenticate the user
router.get("/refresh-token", handleRefreshToken);

export default router;
