import express from "express";
import { getUserProfile } from "../controllers/authController.js";
import verifyJwt from "../middelware/verifyJWT.js";
import { getAllUsers } from "../controllers/authController.js"; // Assuming you have a controller for user-related actions
const userRouter = express.Router();

userRouter.get("/profile", verifyJwt, getUserProfile);
userRouter.get("/users/", verifyJwt, getAllUsers); // Optional: Get profile by user ID

export default userRouter;
