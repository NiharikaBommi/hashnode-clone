import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUserById, updateUserProfile } from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.get('/:id', getUserById);
userRoutes.put('/me', authMiddleware, updateUserProfile);

export default userRoutes;