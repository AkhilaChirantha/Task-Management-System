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
  const [project, setProject] = useState<any>(null); // State to store the project details
  const navigate = useNavigate();
  const { projectId } = useParams();

  // Fetch project details and users
  useEffect(() => {
    const fetchProjectAndUsers = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch project details
        const projectResponse = await axios.get(`http://localhost:5001/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(projectResponse.data);

        // Fetch users for the "Assigned To" dropdown
        const usersResponse = await axios.get(`http://localhost:5001/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch project or users');
      }
    };

    fetchProjectAndUsers();
  }, [projectId, navigate]);

  // Handle task creation
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5001/api/tasks`,
        { title, description, priority, dueDate, assignedTo, project: projectId }, // Include project ID
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Task created:', response.data);
      // Reset the form after successful creation
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setAssignedTo([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

    // Handle project deletion
    const handleDeleteProject = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate('/profile'); // Redirect to the profile page after deletion
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete project');
      }
    };


  return (
    <>
      <div>Project: {project?.name}</div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Create New Task</h3>
      <form onSubmit={handleCreateTask}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
          />
        </div>

        <div>
          <label>Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            required
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div>
          <label>Assign To:</label>
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
          <button type="submit" onClick={() => navigate(`/projects/${projectId}/board`)}>Create Task</button>
        </div>
      </form>

      {/* Link to the Task Board Page */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate(`/projects/${projectId}/board`)}>
          Go to Task Board
        </button>

        <button
          onClick={handleDeleteProject}
          style={{
            backgroundColor: '#FF4500',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Delete Project
        </button>
      </div>
    </>
  );
}