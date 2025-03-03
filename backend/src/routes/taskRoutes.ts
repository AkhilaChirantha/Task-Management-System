import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { createTask, deleteTask, getAllTasks, updateTask } from '../controllers/taskController';

const taskRouter = express.Router();

taskRouter.post('/', authMiddleware, createTask);
taskRouter.get('/', authMiddleware, getAllTasks);
taskRouter.put('/:id', authMiddleware, updateTask);
taskRouter.delete('/:id', authMiddleware,deleteTask);

export default taskRouter;