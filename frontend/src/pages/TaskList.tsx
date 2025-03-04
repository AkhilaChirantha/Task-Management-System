import axios from 'axios';
import  { useEffect, useState } from 'react'

export default function TaskList() {
const [ error , setError ] = useState('');
const [tasks, setTasks] = useState<any[]>([]);

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
          </li>
        ))}
      </ul>
    </div>
  )
}
