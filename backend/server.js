import express from "express";
import connectToDataBase from "./database/connectionToDataBase.js";
import dotenv from "dotenv";
import authRoute from "./routes/auth-route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoute);

connectToDataBase();

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

//i9uMVamapWMwb7cy
