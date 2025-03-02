import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handlesubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setError('');

        try{
            const response = await axios.post(`http://localhost:5001/api/register`,{
                name,
                email,
                password,
              
            });
            console.log(response.data);
            navigate('/')
        }
        catch (err: any) {
            setError(err.response?.data?.message || "Registration FailedFailed 🫣🫣 ");
        }
    }

  
    return (
    <>
    <div>Register</div>
    {error && <p style={{ color: 'red' }}>{error}</p>}

    <form onSubmit={handlesubmit}>
        <div>
             Name :
            <input type="text" value={name} required onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
            Email :
            <input type ="email" value={email} required  onChange={(e) => setEmail(e.target.value)}/>
        </div>

        <div>
            Password :
            <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} />
        </div>

      
        
        <div>
            <button type="submit">Register</button>
            <button type="reset">Close</button>
        </div>
    </form>
      
    </>
  )
}
