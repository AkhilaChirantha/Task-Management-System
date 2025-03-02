import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [ error, setError] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const navigate = useNavigate();


    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`http://localhost:5001/api/user/login`, {
                email,
                password
            })
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            navigate('/profile');
            
        } catch (err:any) {
            setError(err.response?.data?.message || "Login FailedFailed 😬😑 ");
            
        }
    }


  return (
    <>
      <div>Login</div>
      {error && <p style={{color:'red'}}>{error}</p> }


      <form onSubmit={handleSubmit}>
      <div>
        Email :
        <input type='email' value={email} required onChange={(e) => setEmail(e.target.value)}/>
      </div>

      <div>
        Password :
        <input type ="password" value={password} required onChange={(e) => setPassword(e.target.value)}/>
      </div>

      <div>
        <button type="submit">Login</button>
        <button type="reset">Reset</button>
      </div>

      </form>
    </>
  )
}
