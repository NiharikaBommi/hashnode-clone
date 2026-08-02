import express from "express";
import { registerUser, loginUser, getCurrentUser, createPost } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", authMiddleware, getCurrentUser);
authRouter.post("/posts", authMiddleware, createPost);
export default authRouter;