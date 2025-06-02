import express from "express";
import { getUserProfile } from "../controllers/authController.js";
import verifyJwt from "../middelware/verifyJWT.js";
const userRouter = express.Router();

userRouter.get("/profile", verifyJwt, getUserProfile);

export default userRouter;
