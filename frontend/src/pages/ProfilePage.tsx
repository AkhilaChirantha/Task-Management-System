import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const [error, setError] = useState('');
    const [user, setUser] = useState<{name: string, role: string} | null>(null);

    const navigate = useNavigate();


    useEffect(() => {
        const fetchProfile = async () =>{
            const token = localStorage.getItem('token');

            if(!token){
                navigate(`/login`);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5001/api/user/profile`, {
                    headers:{Authorization: `Bearer ${token}`}
                });
                setUser(response.data.user);
                
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch profile');
                localStorage.removeItem('token'); // Clear invalid token
                navigate('/login'); // Redirect to login on error
            }
        };

        fetchProfile();

    },[navigate]);
    
  return (
    <>
    <div>Profile Page 😎</div>
    {error && <p style={{color:'red'}}>{error}</p>}


    {user &&(
        <div>
            <p>User Name : {user.name}</p>
            <p>User Role : {user.role}</p>

            <button type="button" onClick={() => navigate("/taskform/create")}>
        Logout
      </button>
        </div>
        
    )}

      
    </>
  )
}
