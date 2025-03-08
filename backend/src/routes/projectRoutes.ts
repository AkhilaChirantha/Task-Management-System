import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { createProject, deleteProject, getProjectById, getProjects, getProjectTasks, updateProject } from '../controllers/projectController';


const projectRoute = express.Router();

//Create a new Project
projectRoute.post('/', authMiddleware,createProject);

//Get all Projects
projectRoute.get('/', authMiddleware,getProjects);

//Get the Project by Id
projectRoute.get('/:id', authMiddleware, getProjectById);

//Update the Project
projectRoute.put('/:id', authMiddleware, updateProject);

//Delete the Project
projectRoute.delete('/:id', authMiddleware, deleteProject);

//Get Task for specific Project
projectRoute.get('/:projectId/tasks', authMiddleware, getProjectTasks);

export default projectRoute;