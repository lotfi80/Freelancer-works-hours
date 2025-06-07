import express from "express";

import {
  //   getAllClients,
  createClient,

  //   updateClient,
  //   deleteClient,
} from "../controllers/clientsController.js";
import verifyJwt from "../middelware/verifyJWT.js";
const clientsRouter = express.Router();

clientsRouter.use(verifyJwt);
// clientsRouter.get("/", getAllClients);
clientsRouter.post("/add-client", createClient);

export default clientsRouter;
