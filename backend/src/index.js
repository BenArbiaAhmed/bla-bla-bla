import express from 'express';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import {connectDB} from "./lib/db.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes)

const port = process.env.PORT;
app.listen(port, (req, res) => {
    console.log("Server started on port : " + port);
    connectDB();
})