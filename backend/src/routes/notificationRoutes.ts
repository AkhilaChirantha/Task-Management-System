// routes/notificationRoutes.ts
import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController';
import { authMiddleware } from '../middleware/authMiddleware';

const notificationRouter = express.Router();

notificationRouter.get('/', authMiddleware, getNotifications);
notificationRouter.put('/:id/read', authMiddleware, markAsRead);

export default notificationRouter;