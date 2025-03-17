import { Request, Response } from "express";
import Notification from "../models/Notification";


// Get all notifications for a user
export const getNotifications = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;

  try {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .populate('projectId', 'name'); // Populate the project name

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};
// Mark a notification as read
export const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};

// Delete a single notification
export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
};

// Delete all notifications for a user
export const deleteAllNotifications = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;

  try {
    await Notification.deleteMany({ userId });
    res.json({ message: 'All notifications deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting all notifications' });
  }
};