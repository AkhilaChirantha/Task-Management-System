import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TaskFormPage() {
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState<string[]> ([]); //Array type
  const [users, setUsers] = useState<any[]>([]); // State to store the list of users
  const navigate = useNavigate();

  // Fetch the list of users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5001/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5001/api/tasks/`,
        { title, description, priority, dueDate, assignedTo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data);
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task 😢😢😢😢');
    }
  };

  return (
    <>
      <div>Create Task</div>
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
          <select  value={priority} onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}>
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
          <button type="submit">Create Task</button>
        </div>
      </form>
    </>
  );
}