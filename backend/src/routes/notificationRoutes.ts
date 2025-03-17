// routes/notificationRoutes.ts
import express from 'express';
import { deleteAllNotifications, deleteNotification, getNotifications, markAsRead } from '../controllers/notificationController';
import { authMiddleware } from '../middleware/authMiddleware';

const notificationRouter = express.Router();

notificationRouter.get('/', authMiddleware, getNotifications);
notificationRouter.put('/:id/read', authMiddleware, markAsRead);
notificationRouter.delete('/:id', authMiddleware, deleteNotification); // Delete a single notification
notificationRouter.delete('/', authMiddleware, deleteAllNotifications); // Delete all notifications

export default notificationRouter;