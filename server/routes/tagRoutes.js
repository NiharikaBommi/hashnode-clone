import express from "express";
import { getAllTags, getPostByTag } from "../controllers/tagController.js";

const tagRoutes = express.Router();
tagRoutes.get('/', getAllTags);
tagRoutes.get('/:slug/posts', getPostByTag);

export default tagRoutes;