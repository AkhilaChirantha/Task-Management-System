import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from '../controllers/taskController';

const taskRouter = express.Router();

taskRouter.post('/', authMiddleware, createTask);
taskRouter.get('/', authMiddleware, getAllTasks);
taskRouter.put('/:id', authMiddleware, updateTask);
taskRouter.delete('/:id', authMiddleware,deleteTask);
taskRouter.get('/:id', getTaskById);

export default taskRouter;