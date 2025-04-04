import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProjectTasksPage() {
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState<string[]>([]); // Array of user IDs
  const [users, setUsers] = useState<any[]>([]); // State to store the list of users
  const [projects, setProjects] = useState<any[]>([]); // State to store the list of projects
  const [selectedProject, setSelectedProject] = useState<string>(''); // Selected project ID
  const [isEditing, setIsEditing] = useState(false); // State to toggle between create and edit mode
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null); // State to store the task ID being edited
  const navigate = useNavigate();
  const { projectId } = useParams();

  // Fetch the list of users and projects
  useEffect(() => {
    const fetchUsersAndProjects = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch users
        const usersResponse = await axios.get(`http://localhost:5001/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data);

        // Fetch projects created by the logged-in user
        const projectsResponse = await axios.get(`http://localhost:5001/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projectsResponse.data);
      } catch (err) {
        console.error('Failed to fetch users or projects', err);
      }
    };

    fetchUsersAndProjects();
  }, [navigate]);

  // Fetch task data if updating
  useEffect(() => {
    if (editingTaskId) {
      const fetchTask = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5001/api/tasks/${editingTaskId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const task = response.data;
          setTitle(task.title);
          setDescription(task.description);
          setPriority(task.priority);
          setDueDate(new Date(task.dueDate).toISOString().split('T')[0]); // Format date for input field
          setAssignedTo(task.assignedTo.map((user: any) => user._id)); // Set assigned users
          setSelectedProject(task.project); // Set the project ID
        } catch (err) {
          console.error('Failed to fetch task', err);
        }
      };

      fetchTask();
    }
  }, [editingTaskId]);

  // Handle task creation or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = isEditing ? `http://localhost:5001/api/tasks/${editingTaskId}` : `http://localhost:5001/api/tasks/`;
      const method = isEditing ? 'put' : 'post';

      const response = await axios[method](
        url,
        { title, description, priority, dueDate, assignedTo, project: selectedProject }, // Include project ID
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data);
      navigate(`/projects/${projectId}/board`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save task 😢😢😢😢');
    }
  };

  // Handle task update (populate form for editing)
  const handleUpdate = (taskId: string) => {
    setIsEditing(true);
    setEditingTaskId(taskId);
  };

  return (
    <>
      <div>{isEditing ? 'Update Task' : 'Create Task'}</div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          Title :
          <input type="text" value={title} required onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          Description :
          <input type="text" value={description} required onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          Priority :
          <select value={priority} onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          Due Date :
          <input type="date" value={dueDate} required onChange={(e) => setDueDate(e.target.value)} />
        </div>

        <div>
          Assign To:
          <select
            multiple // Allow multiple selections
            value={assignedTo}
            required
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
              setAssignedTo(selectedOptions);
            }}
          >
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          Project:
          <select
            value={selectedProject}
            required
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button type="submit">{isEditing ? 'Update Task' : 'Create Task'}</button>
        </div>

        <div>
          <button type="button" onClick={() => navigate(`/projects/${projectId}/board`)}>View Task</button>
        </div>
      </form>
    </>
  );
}