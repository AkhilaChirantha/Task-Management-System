import { Request, Response } from "express"
import Task from "../models/Task";
import Notification from "../models/Notification"; 

//Create a new Task
export const createTask = async (req: Request, res: Response) => {
    const { title, description, priority, dueDate, assignedTo, project } = req.body;
    const createdBy = (req as any).user._id;
  
    try {
      const task = new Task({
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        createdBy,
        project,
      });
      await task.save();
  
      // Send notifications to assigned users
      for (const userId of assignedTo) {
        const notification = new Notification({
          userId,
          message: `You have been assigned to the task "${title}" in project "${task.project}".`,
          projectId: task.project, // Link the notification to the project
        });
        await notification.save();
      }
  
      res.status(201).json({ message: 'Task saved successfully 🥳', task });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };

//Update a Task
export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, priority, status, dueDate, assignedTo, project } = req.body;
  
    try {
      const task = await Task.findByIdAndUpdate(
        id,
        { title, description, priority, status, dueDate, assignedTo, project },
        { new: true }
      ).populate('assignedTo', 'name email').populate('createdBy', 'name email');
  
      if (!task) {
        res.status(404).json({ message: 'Task not found 🫠' });
        return;
      }
  
      // Send notifications to newly assigned users
      for (const userId of assignedTo) {
        const notification = new Notification({
          userId,
          message: `You have been assigned to the task "${title}" in project "${task.project}".`,
          projectId: task.project, // Link the notification to the project
        });
        await notification.save();
      }
  
      res.json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };

//Delete a task
export const deleteTask = async (req:Request, res:Response) => {
    const { id } = req.params;

    try {
        const task = await Task.findByIdAndDelete(id);
        if(!task){
            res.status(404).json({message : ' එහෙම task එකක් add කරලා නැතෝ 🫠'});
            return;
        }
        res.json({message:'Task deleted successfully 🥸'});
        
    } catch (err) {
        console.log(err);
        res.status(500).json({message:"Server Error"});
    }
}

//Get all Tasks
export const getAllTasks = async(req:Request, res:Response) => {

    try {
        const task = await Task.find().populate('assignedTo', 'name email').populate('createdBy', 'name email');
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Server Error'});
    }
}

// Get a single task by ID
export const getTaskById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        if (!task) {
            res.status(404).json({ message: 'Task not found 🫠' });
            return;
        }
        res.json(task);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};