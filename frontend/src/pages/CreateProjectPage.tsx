import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateProjectPage() {
  const [error, setError] = useState('');
  const [user, setUser] = useState<{name: string, role: string, email: string, avatar:string} | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [projectManager, setProjectManager] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = new URLSearchParams(location.search).get('token') || localStorage.getItem('token');
  
      if (!token) {
        navigate('/login');
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5001/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
  
        localStorage.setItem('token', token); // Store the token if it came from URL
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/login'); // Redirect to login on error
      }
    };
  
    fetchProfile();
  }, [navigate, location]);

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
      navigate('/profile'); // Redirect to profile page after creation
      console.log('Project created:', response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project 😢');
    }
  };


  const handleReset = () => {
    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setProjectManager('');
  }

  return (
    <>
    <div style={{ margin:'20px 40px 20px 40px', borderRadius:'10px', backgroundColor:'#F3F3F3'}}>
     <div style={{display:'flex', padding:'30px 30px 30px 30px', fontFamily:'Iowan Old Style',alignItems:'center', }}>
      <div style={{ fontSize:'28px', fontWeight:'600'}}>Task Management System </div>
      {user && (
        <>
            <div style={{fontSize:'16px', fontWeight:'200', marginLeft:'auto', paddingRight:'20px'}}>{user.name}</div>
            <div style={{
              position: 'relative',
              width: '40px', // Avatar width + border width
              height: '40px', // Avatar height + border height
              borderRadius: '50%', // Makes the container circular
              background: 'linear-gradient(45deg, #FFEA02 , #FF07E6', // Gradient border
              padding: '3px', // Space for the inner white border
            }}> 
           <img src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=YourSeed=${encodeURIComponent(user.email)}`} 
           style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%', // Makes the image circular
              border: '3px solid white', // Inner border (white)
              display: 'block', // Ensures the image behaves as a block element
              background:'#F3F3F3',
              }} />
            </div>
        </>
      )}
     </div>
     </div>

     <div style={{fontFamily:'Iowan Old Style', fontSize:'20px', fontWeight:'400', marginLeft:'40px'}}>Create a New Project</div>


     <div style={{fontFamily:'Iowan Old Style', fontSize:'18px', fontWeight:'400', marginLeft:'40px',paddingTop:'20px'}}>Project Name<span style={{color:'red'}}>*</span></div>
     <div style={{margin:'10px 40px 0 40px', }}>
     <input type='text' value={name} required={true} onChange={(e) => setName(e.target.value)}  style={{ width:'100%',height:'50px', border:'none', backgroundColor:'#F3F3F3', borderRadius:'10px' }}/>
     </div>


     <div style={{fontFamily:'Iowan Old Style', fontSize:'18px', fontWeight:'400', marginLeft:'40px',paddingTop:'20px'}}>Project Description</div>
     <div style={{margin:'10px 40px 0 40px', }}>
      <textarea 
        value={description} 
        required={true} 
        onChange={(e) => setDescription(e.target.value)}  
        style={{ width:'100%',height:'80px', border:'none', backgroundColor:'#F3F3F3', borderRadius:'10px' }}/>
     </div>

     <div style={{display:'flex', justifyContent:'flex-start', margin:'0px 40px 40px 40px', gap:'92px' }}>
          <div style={{display:'flow', width:'46%'}}>
              <div style={{fontFamily:'Iowan Old Style', fontSize:'18px', fontWeight:'400', paddingTop:'20px'}}>Project Starting Date<span style={{color:'red'}}>*</span></div>
              <div style={{marginTop:'10px'}}>
                <input type='date' value={startDate} required={true} onChange={(e) => setStartDate(e.target.value)}  style={{ width:'100%', height:'50px', border:'none', backgroundColor:'#F3F3F3', borderRadius:'10px', padding:'0 10px 0 10px' }}/>
              </div>
          </div>

          <div style={{display:'flow', width:'46%'}}>
              <div style={{fontFamily:'Iowan Old Style', fontSize:'18px', fontWeight:'400', paddingTop:'20px'}}>Project Ending Date<span style={{color:'red'}}>*</span></div>
              <div style={{marginTop:'10px'}}>
                <input type='date' value={endDate} required={true} onChange={(e) => setEndDate(e.target.value)}  style={{ width:'100%', height:'50px', border:'none', backgroundColor:'#F3F3F3', borderRadius:'10px', padding:'0 10px 0 10px' }}/>
              </div>
          </div>
    </div>


    <div style={{fontFamily:'Iowan Old Style', fontSize:'18px', fontWeight:'400', marginLeft:'40px'}}>Project Manager<span style={{color:'red'}}>*</span></div>
    <div style={{margin:'10px 40px 0 40px', }}>
     <input type='text' value={projectManager} required={true} onChange={(e) => setProjectManager(e.target.value)}  style={{ width:'100%',height:'50px', border:'none', backgroundColor:'#F3F3F3', borderRadius:'10px' }}/>
    </div>


    <div style={{display:'flex', justifyContent:'center', paddingTop:'40px', gap:'50px'}}>
    <button style={{width:'300px', height:'50px', borderRadius:'10px', backgroundColor:'#F88A1A', color:'#ffffff',border:'none', fontFamily:'Iowan Old Style', fontSize:'18px', fontWeight:'400'}} onClick={handleSubmit}>Create Project</button>
    <button style={{width:'300px', height:'50px', borderRadius:'10px',  color:'#000000',border:'1px solid ', fontFamily:'Iowan Old Style', fontSize:'18px', fontWeight:'400',backgroundColor:'#ffffff' }} onClick={handleReset}>Cancel</button>
    </div>


    </>
  );
}