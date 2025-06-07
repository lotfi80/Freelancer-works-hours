import express from "express";
import { getUserProfile } from "../controllers/authController.js";
import verifyJwt from "../middelware/verifyJWT.js";
import { getAllUsers } from "../controllers/authController.js";
import { updateUserProfile } from "../controllers/authController.js";
import {
  //   getAllClients,
  createClient,
  getClients,
  getClientById,
  updateClient,
  //   updateClient,
  deleteClient,
} from "../controllers/clientsController.js";
import {
  addTimeEntry,
  getTimeEntries,
  getTimeEntryByClient,
} from "../controllers/TimeEntryController.js";

const userRouter = express.Router();
userRouter.use(verifyJwt);

userRouter.get("/profile", getUserProfile);
userRouter.get("/users/", getAllUsers);
userRouter.patch("/update-profile", updateUserProfile);
userRouter.post("/add-client", createClient);
userRouter.get("/clients", getClients);
userRouter.get("/clients/:id", getClientById);
userRouter.patch("/clients/:id", updateClient);
userRouter.delete("/clients/:id", deleteClient);
userRouter.post("/add-time-entry", addTimeEntry);
userRouter.get("/time-entries", getTimeEntries);
userRouter.get("/time-entries/client/:clientId", getTimeEntryByClient);

export default userRouter;
