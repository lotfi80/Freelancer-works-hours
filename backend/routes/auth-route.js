import express from "express";
import {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  logout,
  resetPassword,
  //   getUserProfile,
  handleRefreshToken,
} from "../controllers/authController.js";
// import { handleRefreshToken } from "../utils/generateJWTToken.js";
// import verifyJwt from "../middelware/verifyJWT.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/verify-email/", verifyEmail);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);
// router.get("/profile", verifyJwt, getUserProfile); // Assuming you have a middleware to authenticate the user
authRouter.get("/refresh-token", handleRefreshToken);

export default authRouter;
