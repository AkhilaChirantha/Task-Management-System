import { Request, Response } from "express";
import Project from "../models/Project";
import Task from "../models/Task";
import Notification from "../models/Notification";
import User from "../models/User";

//Create a new Project
export const createProject = async (req: Request, res: Response) => {
  const { name, description, startDate, endDate, projectManager, assignedUsers } = req.body;
  const createdBy = (req as any).user._id;

  try {
    const sameNameProject = await Project.findOne({ name });
    if (sameNameProject) {
      res.status(400).json({ message: 'Project with that name already exists. Please use a different project name. 😇😇' });
      return;
    }

    const project = new Project({ name, description, startDate, endDate, projectManager, createdBy, assignedUsers });
    await project.save();

    // Send notifications to assigned users
    for (const userId of assignedUsers) {
      const notification = new Notification({
        userId,
        message: `You have been assigned to the project "${name}".`,
        projectId: project._id,
      });
      await notification.save();
    }

    res.status(201).json({ message: "Project created successfully 👌❤️", project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project / Server Error' });
  }
};

//Get all Projects
// Get all Projects for the profile page (only unseen projects)
export const getProjects = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;

  try {
    // Fetch the user to get the list of seen projects
    const user = await User.findById(userId).select('seenProjects');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Fetch projects that the user has not seen
    const projects = await Project.find({ _id: { $nin: user.seenProjects } });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
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
export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, startDate, endDate, projectManager, assignedUsers } = req.body;

  try {
    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, startDate, endDate, projectManager, assignedUsers },
      { new: true }
    );

    if (!project) {
      res.status(404).json({ message: 'Project not found ☹️' });
      return;
    }

    // Send notifications to newly assigned users
    for (const userId of assignedUsers) {
      const notification = new Notification({
        userId,
        message: `You have been assigned to the project "${name}".`,
        projectId: project._id,
      });
      await notification.save();
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project / Server Error' });
  }
};

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

