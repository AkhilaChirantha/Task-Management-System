import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ProfilePage() {
    const [error, setError] = useState('');
    const [user, setUser] = useState<{name: string, role: string} | null>(null);
    const [ projects, setProjects ] = useState<any[]>([]);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = new URLSearchParams(location.search).get('token') || localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5001/api/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.user);

                 // Fetch projects created by the user
                const projectsResponse = await axios.get(`http://localhost:5001/api/projects`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProjects(projectsResponse.data);


                localStorage.setItem('token', token); // Store the token if it came from URL
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch profile');
                localStorage.removeItem('token'); // Clear invalid token
                navigate('/login'); // Redirect to login on error
            }
        };

        fetchProfile();
    }, [navigate, location]);

    return (
        <>
            <div>Profile Page 😎</div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {user && (
        <div>
          <p>User Name: {user.name}</p>
          <p>User Role: {user.role}</p>

          <h3>Your Projects</h3>
          {projects.length > 0 ? (
            <ul>
              {projects.map((project) => (
                <li key={project._id}>
                  <button
                    onClick={() => navigate(`/projects/${project._id}/tasks`)} // Navigate to project tasks page
                    style={{
                      backgroundColor: '#009688',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                      margin: '5px',
                    }}
                  >
                    {project.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No projects found. Create a new project to get started!</p>
          )}

          <button
            onClick={() => navigate('/projects/create')} // Navigate to create project page
            style={{
              backgroundColor: '#009688',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Create New Project
          </button>
        </div>
      )}
        </>
    );
}