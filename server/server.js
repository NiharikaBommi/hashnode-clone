import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
app.get("/", (req, res) => {
    res.send("Hashnode API Running");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRouter);
app.use("/api/posts", postRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/users", userRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});