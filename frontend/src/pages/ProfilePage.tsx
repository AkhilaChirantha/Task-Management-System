import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, } from 'react-router-dom';
import { CiTrash } from "react-icons/ci";
import NotificationComponent from '../components/Notification';

export default function ProfilePage() {
    const [error, setError] = useState('');
    const [user, setUser] = useState<{name: string, role: string, email: string, avatar:string} | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

  // Fetch profile and projects
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

        // Fetch all projects with the "isNew" flag
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


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Open confirmation dialog
    const openDeleteConfirmation = (projectId: string) => {
        setProjectToDelete(projectId);
        setShowDeleteConfirmation(true);
    };

    // Close confirmation dialog
    const closeDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
        setProjectToDelete(null);
    };

    // Handle project deletion
    const handleDeleteProject = async () => {
        if (!projectToDelete) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/projects/${projectToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Deleted project successfully");
        
            // Remove the deleted project from the state
            setProjects(projects.filter((project) => project._id !== projectToDelete));
            
            // Close the confirmation dialog
            closeDeleteConfirmation();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete project');
            closeDeleteConfirmation();
        }
    };

    return (
        <>
        {/* Top Bar */}
        <div style={{display:'flex', alignItems:'center',fontFamily:'Iowan Old Style'}}>
          <img src='logo.jpg' style={{width:'122px', height:'122px',}}/>
          <div style={{fontSize:'24px',fontWeight:'500'}}> ABC Consulting</div>
          <div style={{fontSize:'30px',fontWeight:'600', marginLeft:'auto', padding:'40px'}}> Task Management System</div>
        </div>

        {/* Welcome Section */}
        {user && (
            <div style={{ backgroundColor:'#F3F3F3',display:'flex', alignItems:'center', height:'80px', margin:'0 40px 0 40px',borderRadius:'10px', fontFamily:'Iowan Old Style'  }}>
                <div style={{fontSize:'20px', fontWeight:'400', paddingLeft:'40px'}}>Welcome 🥰</div>
                <div style={{fontSize:'24px', fontWeight:'500', color:'#379413', paddingLeft:'25px'}}>{user.name}</div>
                <div style={{fontSize:'16px', fontWeight:'200', marginLeft:'auto', paddingRight:'20px'}}>{user.email}</div>
                <div style={{
                        position: 'relative',
                        width: '56px', // Avatar width + border width
                        height: '56px', // Avatar height + border height
                        borderRadius: '50%', // Makes the container circular
                        background: 'linear-gradient(45deg, #FFEA02 , #FF07E6', // Gradient border
                        padding: '3px', // Space for the inner white border
                        marginRight:'40px'
                    }}> 
                    <img src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=YourSeed=${encodeURIComponent(user.email)}`} 
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%', // Makes the image circular
                        border: '3px solid white', // Inner border (white)
                        display: 'block', // Ensures the image behaves as a block element
                        background:'#F3F3F3',
                    }} />
                </div>
                <div style={{marginRight:'40px'}}><NotificationComponent/></div>
                
            </div>
        )}

        {/* New Project Button */}
        <div style={{ display:'flex', justifyContent:'end', paddingRight:'40px'}}>
            <button style={{width:'160px', height:'45px', fontFamily:'Iowan Old Style', fontSize:'18px', border:'none', backgroundColor:'#F88A1A', color:'#ffffff', borderRadius:'10px', marginTop:'30px',cursor:'pointer'}} onClick={() => navigate('/projects/create')}>New Project</button>
        </div>

        {/* Project Table - Using CSS Grid */}
        <div style={{ padding: '0 50px', fontFamily: 'Iowan Old Style' }}>
            {/* Table Grid Container */}
            <div style={{ 
                display: 'grid',
                gridTemplateColumns: '224px 400px 160px 160px 220px 100px 10px',
                gap: '10px',
                marginTop: '30px'
            }}>
                {/* Table Headers */}
                <div style={{ fontSize: '18px', fontWeight: '500', cursor:'default'  }}>Name</div>
                <div style={{ fontSize: '18px', fontWeight: '500', cursor:'default'  }}>Description</div>
                <div style={{ fontSize: '18px', fontWeight: '500', cursor:'default'  }}>Starting date</div>
                <div style={{ fontSize: '18px', fontWeight: '500', cursor:'default'  }}>End Date</div>
                <div style={{ fontSize: '18px', fontWeight: '500', cursor:'default'  }}>Project Manager</div>
                <div style={{ fontSize: '18px', fontWeight: '500', cursor:'default'  }}>Status</div>
                <div></div>
                
                {/* Table Data */}
                {projects.map((project) => (
                    <React.Fragment key={project._id}>
                        <div style={{ fontSize: '16px', fontWeight: '400', paddingTop: '15px', color:'blue', cursor:'pointer' }} onClick={() => navigate(`/projects/${project._id}/tasks`)}>{project.name}</div>
                        <div style={{ fontSize: '16px', fontWeight: '400', paddingTop: '15px', cursor:'default' }}>{project.description}</div>
                        <div style={{ fontSize: '16px', fontWeight: '400', paddingTop: '15px', cursor:'default' }}>{formatDate(project.startDate)}</div>
                        <div style={{ fontSize: '16px', fontWeight: '400', paddingTop: '15px', cursor:'default' }}>{formatDate(project.endDate)}</div>
                        <div style={{ fontSize: '16px', fontWeight: '400', paddingTop: '15px', cursor:'default' }}>{project.projectManager}</div>
                        <div style={{ fontSize: '16px', fontWeight: '400', paddingTop: '15px', cursor:'default' }}>{project.status}</div>
                        <div style={{ paddingTop: '15px', cursor:'pointer'}} onClick={() => openDeleteConfirmation(project._id)}>
                            <CiTrash color='blue' />
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    width: '400px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    fontFamily: 'Iowan Old Style'
                }}>
                    <h3 style={{ 
                        fontSize: '20px', 
                        marginBottom: '20px', 
                        textAlign: 'center' 
                    }}>
                        Are You Sure?
                    </h3>
                    <p style={{ 
                        fontSize: '16px', 
                        marginBottom: '20px', 
                        textAlign: 'center' 
                    }}>
                        This action cannot be undone. The project and all its data will be permanently deleted.
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginTop: '20px' 
                    }}>
                        <button 
                            onClick={closeDeleteConfirmation}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#f3f3f3',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                width: '45%'
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleDeleteProject}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#FF3B30',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                width: '45%'
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}