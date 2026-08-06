import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getPosts, getPostBySlug, updatePostById, deletePostById, getMyPosts } from "../controllers/postController.js";

const postRoutes = express.Router();
postRoutes.get('/', getPosts);
postRoutes.get('/mine', authMiddleware, getMyPosts);
postRoutes.get('/:slug', getPostBySlug);
postRoutes.put('/:id', authMiddleware, updatePostById);
postRoutes.delete('/:id', authMiddleware, deletePostById);


export default postRoutes;