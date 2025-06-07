import express from "express";
import connectToDataBase from "./database/connectionToDataBase.js";
import dotenv from "dotenv";
import authRouter from "./routes/auth-route.js";
import userRouter from "./routes/getUserProfiil.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import clientsRouter from "./routes/clientsRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // dein Vite-Frontend
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
// app.use("/api/clients", clientsRouter);

connectToDataBase();
const PORT = process.env.PORT || 5000;
app.listen(3000, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

//i9uMVamapWMwb7cy
