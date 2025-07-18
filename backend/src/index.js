import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

const port = process.env.PORT;
app.listen(port, (req, res) => {
    console.log("Server started on port : " + port);
    connectDB();
})