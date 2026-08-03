import express from "express";
import { getPosts, getPostBySlug } from "../controllers/postController.js";

const postRoutes = express.Router();
postRoutes.get('/', getPosts);
postRoutes.get('/:slug', getPostBySlug);

export default postRoutes;