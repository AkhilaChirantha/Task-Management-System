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
  const [isEditing, setIsEditing] = useState(false); // State to toggle between create and edit mode
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null); // State to store the task ID being edited
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();

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
        setUsers(usersResponse.data); // Set the list of users
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch project or users');
      }
    };

    fetchProjectAndUsers();
  }, [projectId, navigate]);

  // Fetch task data if updating
  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5001/api/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const task = response.data;
          setTitle(task.title);
          setDescription(task.description);
          setPriority(task.priority);
          setDueDate(new Date(task.dueDate).toISOString().split('T')[0]); // Format date for input field
          setAssignedTo(task.assignedTo.map((user: any) => user._id)); // Set assigned users
          setIsEditing(true);
          setEditingTaskId(taskId);
        } catch (err) {
          console.error('Failed to fetch task', err);
        }
      };

      fetchTask();
    }
  }, [taskId]);

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
        { title, description, priority, dueDate, assignedTo, project: projectId }, // Include project ID
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data);
      navigate(`/projects/${projectId}/board`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  // Handle user selection for assignment
  const handleUserSelection = (userId: string) => {
    if (assignedTo.includes(userId)) {
      // If the user is already selected, remove them
      setAssignedTo(assignedTo.filter((id) => id !== userId));
    } else {
      // If the user is not selected, add them
      setAssignedTo([...assignedTo, userId]);
    }
  };

  return (
    <>
      <div style={{ margin: '20px 40px 20px 40px', borderRadius: '10px', backgroundColor: '#F3F3F3' }}>
        <div style={{ display: 'flex', padding: '30px 30px 30px 30px', fontFamily: 'Iowan Old Style', alignItems: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '600' }}>Task Management System </div>
        </div>
      </div>

      <div style={{ display: 'flex', margin: '0px 40px 0px 0px', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '' }}>
        <div style={{ fontFamily: 'Iowan Old Style', fontSize: '22px', fontWeight: '600', marginLeft: '40px', color: '#379413' }}>{project?.name}</div>
        <div style={{ fontFamily: 'Iowan Old Style', fontSize: '20px', fontWeight: '400', marginLeft: '40px' }}>{isEditing ? 'Update Task' : 'Create New Task'}</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ fontFamily: 'Iowan Old Style', fontSize: '18px', fontWeight: '400', marginLeft: '40px', paddingTop: '20px' }}>Task<span style={{ color: 'red' }}>*</span></div>
        <div style={{ margin: '10px 40px 0 40px' }}>
          <input type='text' value={title} required={true} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', height: '50px', border: 'none', backgroundColor: '#F3F3F3', borderRadius: '10px' }} />
        </div>

        <div style={{ fontFamily: 'Iowan Old Style', fontSize: '18px', fontWeight: '400', marginLeft: '40px', paddingTop: '20px' }}>Project Description</div>
        <div style={{ margin: '10px 40px 0 40px' }}>
          <textarea
            value={description}
            required={true}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', height: '60px', border: 'none', backgroundColor: '#F3F3F3', borderRadius: '10px' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '0px 40px 40px 40px', gap: '92px' }}>
          <div style={{ display: 'flow', width: '46%' }}>
            <div style={{ fontFamily: 'Iowan Old Style', fontSize: '18px', fontWeight: '400', paddingTop: '20px' }}>Due Date<span style={{ color: 'red' }}>*</span></div>
            <div style={{ marginTop: '10px' }}>
              <input type='date' value={dueDate} required={true} onChange={(e) => setDueDate(e.target.value)} style={{ width: '100%', height: '50px', border: 'none', backgroundColor: '#F3F3F3', borderRadius: '10px', padding: '0 10px 0 10px' }} />
            </div>
          </div>

          <div style={{ display: 'flow', width: '46%' }}>
            <div style={{ fontFamily: 'Iowan Old Style', fontSize: '18px', fontWeight: '400', paddingTop: '20px' }}>Priority<span style={{ color: 'red' }}>*</span></div>
            <div style={{ marginTop: '10px' }}>
              <select value={priority} required={true} onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')} style={{ width: '100%', height: '50px', border: 'none', backgroundColor: '#F3F3F3', borderRadius: '10px', padding: '0 10px 0 10px' }}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ fontFamily: 'Iowan Old Style', fontSize: '18px', fontWeight: '400', marginLeft: '40px' }}>Assign Persons<span style={{ color: 'red' }}>*</span></div>
        <div style={{ margin: '10px 40px 0 40px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserSelection(user._id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
                border: assignedTo.includes(user._id) ? '2px solid #F88A1A' : '1px solid #ccc',
                borderRadius: '10px',
                cursor: 'pointer',
                backgroundColor: assignedTo.includes(user._id) ? '#F3F3F3' : '#ffffff',
              }}
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.email)}`}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  border: '2px solid white',
                }}
              />
              <div style={{ marginTop: '5px', fontSize: '14px', textAlign: 'center' }}>{user.name}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px', gap: '50px' }}>
          <button style={{ width: '300px', height: '50px', borderRadius: '10px', color: '#000000', border: '1px solid', fontFamily: 'Iowan Old Style', fontSize: '18px', fontWeight: '400', backgroundColor: '#ffffff' }} onClick={() => navigate(`/projects/${projectId}/board`)}>Tasks Board</button>
          <button type="submit" style={{ width: '300px', height: '50px', borderRadius: '10px', backgroundColor: '#F88A1A', color: '#ffffff', border: 'none', fontFamily: 'Iowan Old Style', fontSize: '18px', fontWeight: '400' }}>{isEditing ? 'Update Task' : 'Create Task'}</button>
          <button style={{ width: '300px', height: '50px', borderRadius: '10px', color: '#000000', border: '1px solid', fontFamily: 'Iowan Old Style', fontSize: '18px', fontWeight: '400', backgroundColor: '#ffffff' }}>Cancel</button>
        </div>
      </form>
    </>
  );
}