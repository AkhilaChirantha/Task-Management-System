import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateProjectPage() {
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [projectManager, setProjectManager] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5001/api/projects',
        { name, description, startDate, endDate, projectManager },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Project created:', response.data);
      navigate('/profile'); // Redirect to profile page after creation
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project 😢');
    }
  };

  return (
    <>
      <div>Create New Project</div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Name:</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            required
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            required
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label>Project Manager:</label>
          <input
            type="text"
            value={projectManager}
            required
            onChange={(e) => setProjectManager(e.target.value)}
            placeholder="Enter project manager's name"
          />
        </div>
        <button type="submit">Create Project</button>
      </form>

      <button onClick={() => navigate('/profile')}>Back to Profile</button>
    </>
  );
}