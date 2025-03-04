import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TaskList() {
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch tasks');
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh the task list after deletion
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleUpdate = (taskId: string) => {
    navigate(`/tasks/update/${taskId}`); // Redirect to the update form
  };

  return (
    <div>
      <h2>Tasks</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Assigned To: {task.assignedTo.map((user: any) => user.name).join(', ')}</p>
            <p>Created By: {task.createdBy.name}</p>
            <button onClick={() => handleUpdate(task._id)}>Update</button>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}