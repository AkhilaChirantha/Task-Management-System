import { Request, Response } from "express";
import Project from "../models/Project";
import Task from "../models/Task";

//Create a new Project
export const createProject = async (req: Request, res: Response) => {
    const { name, description, startDate, endDate, projectManager } = req.body;
    const createdBy = (req as any).user._id; // Ensure this is the logged-in user's ID
  
    try {
      const sameNameProject = await Project.findOne({ name });
      if (sameNameProject) {
        res.status(400).json({ message: 'Project with that name already exists. Please use a different project name. 😇😇' });
        return;
      }
  
      const project = new Project({ name, description, startDate, endDate, projectManager, createdBy });
      await project.save();
  
      res.status(201).json({ message: "Project created successfully 👌❤️", project });
    } catch (error) {
      console.error('Error creating project:', error); // Log the error
      res.status(500).json({ message: 'Error creating project / Server Error' });
    }
  };

//Get all Projects
export const getProjects = async (req: Request, res: Response) => {
    const createdBy = (req as any).user._id; // Ensure this is the logged-in user's ID
  
    try {
      const projects = await Project.find({ createdBy }).select('name description startDate endDate projectManager status');
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error); // Log the error
      res.status(500).json({ message: 'Error getting projects / Server Error' });
    }
  };

//Get Projects by Id
export const getProjectById = async(req:Request, res:Response) => {
    const { id } = req.params;
    
    try {
        const project = await Project.findById(id).populate('createdBy', 'name email');
        if(!project){
            res.status(200).json({ message: 'Project is not found' });
            return;
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error getting project / Server Error' });
    }
}

//Update Project
export const updateProject = async(req:Request, res:Response) => {
    const { id } = req.params;
    const { name, description, startDate, endDate, projectManager } = req.body;

    try {
        const project = await Project.findByIdAndUpdate( id,{name, description, startDate, endDate, projectManager}, {new:true} );
        if(!project){
            res.status(404).json({ message: 'Project not found ☹️' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project / Server Error'});
    }
}

//Delete Project
export const deleteProject = async(req:Request, res:Response) => {
    const { id } = req.params;

    try {
        const project = await Project.findByIdAndDelete(id);
        if(!project){
            res.status(404).json({ message: 'Project not found ☹️' });
        }
        res.json({ message: 'Project deleted successfully 🤩' });
    }
    catch(error){
        res.status(500).json({ message: 'Error deleting project / Server Error' });
    }
}

//Get Projects Tasks
export const getProjectTasks = async (req: Request, res: Response) => {
    const { projectId } = req.params;
  
    try {
      const tasks = await Task.find({ project: projectId })
        .populate('assignedTo', 'name email') // Populate assigned users
        .populate('createdBy', 'name email'); // Populate the task creator
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting tasks / Server Error' });
    }
  };