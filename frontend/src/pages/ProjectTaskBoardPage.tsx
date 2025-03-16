import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CiTrash } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";

export default function ProjectTaskBoardPage() {
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ name: string, role: string, email: string, avatar: string } | null>(null);
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const navigate = useNavigate();
  const { projectId } = useParams();

  // Fetch project details and tasks
  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch project details
        const projectResponse = await axios.get(`http://localhost:5001/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(projectResponse.data);

        // Fetch tasks for the project
        const tasksResponse = await axios.get(`http://localhost:5001/api/projects/${projectId}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Tasks fetched:', tasksResponse.data); // Log the fetched tasks
        setTasks(tasksResponse.data);
      } catch (err: any) {
        console.error('Error fetching tasks:', err); // Log the error
        setError(err.response?.data?.message || 'Failed to fetch project or tasks');
      }
    };

    fetchProjectAndTasks();
  }, [projectId, navigate]);

  // Fetch the user profile
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

  // Handle task deletion
  const handleDelete = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(task => task._id !== taskId)); // Remove the deleted task from the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  // Handle task update (navigate to update page)
  const handleUpdate = (taskId: string) => {
    navigate(`/projects/${projectId}/tasks/${taskId}`);
  };

  // Handle drag-and-drop
  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const task = tasks.find(t => t._id === draggableId);
    const newStatus = destination.droppableId;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/tasks/${draggableId}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newTasks = tasks.map(t => 
        t._id === draggableId ? { ...t, status: newStatus } : t
      );
      setTasks(newTasks);
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  // Group tasks by status
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ fontFamily: 'Iowan Old Style', fontSize: '20px', display: 'flex' , backgroundColor:'#F3F3F3', margin:'40px', padding:'10px 10px 10px 20px', borderRadius:'10px', alignItems:'center' }}>
        <div> Task Board: <span style={{color:'#F88A1A'}}>{project?.name}</span> </div>
        {user && (
          <>
            <div style={{ marginLeft: 'auto',color:'#379413' }}>{user.name}</div>
            <div style={{
              position: 'relative',
              width: '30px', // Avatar width + border width
              height: '30px', // Avatar height + border height
              borderRadius: '50%', // Makes the container circular
              background: 'linear-gradient(45deg, #FFEA02 , #FF07E6', // Gradient border
              padding: '3px', // Space for the inner white border
              marginRight: '40px',
              marginLeft: '10px'
            }}>
              <img src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=YourSeed=${encodeURIComponent(user.email)}`}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%', // Makes the image circular
                  border: '3px solid white', // Inner border (white)
                  display: 'block', // Ensures the image behaves as a block element
                  background: '#F3F3F3',
                }} />
            </div>
          </>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }}>
          {['To do', 'In Progress', 'Done','Waiting'].map((status, index) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    width: '22%',
                    height:'auto',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <h3>{status}</h3>
                  {getTasksByStatus(status).map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          
                        >

                          <div style={{
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            marginBottom: '10px'
                          }}>

                            {/* Task Title and created by person*/}
                            <div style={{display:'flex', alignItems:'center',padding:'7px 20px 0 20px', gap:'30px',fontFamily: 'Iowan Old Style'}}>
                                <div style={{ fontSize:'15px'}}>{task.title}</div>
                                <div style={{marginLeft:'auto'}}>
                                <img
                                    src={task.createdBy.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=YourSeed=${encodeURIComponent(task.createdBy.email)}`}
                                    alt={task.createdBy.name}
                                    style={{ width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer' }}
                                    title={task.createdBy.name} // Tooltip for name
                                  />
                                </div>
                            </div>


                            {/* Task Description */}
                            <div style={{padding:'10px 20px 0 20px ', textAlign:'justify', fontSize:'13px',fontFamily: 'Iowan Old Style'}}>{task.description}</div>


                            {/* Priority  */}
                            <div style={{fontFamily: 'Iowan Old Style', display:'flex', justifyContent:'end', fontSize:'12px', paddingRight:'20px', 
                              color: 
                                  task.priority === 'High' ? '#FF0000' :
                                  task.priority === 'Medium' ? '#FFA500' :
                                  'green'}}>{task.priority} Priority
                            </div>


                            {/* Due Date  */}
                            <div style={{fontFamily: 'Iowan Old Style', display:'flex', justifyContent:'end', fontSize:'12px', paddingRight:'20px'}}>Due Date: {new Date(task.dueDate).toLocaleDateString()}</div>


                            {/* Assigned To */}
                            <div>
                              <div style={{ fontFamily: 'Iowan Old Style', display: 'flex', fontSize: '12px', paddingLeft: '20px' }}>Assigned Persons</div>
                              <div style={{ display: 'flex', alignItems: 'center', paddingLeft:'20px' }}> {/* Add negative margin to the container */}
                                {task.assignedTo.map((user: any, index: number) => (
                                  <div 
                                    key={user._id} 
                                    style={{ 
                                      position: 'relative', 
                                      textAlign: 'center', 
                                      marginLeft: index === 0 ? '0' : '-10px', // Apply negative margin to all avatars except the first one
                                      zIndex: task.assignedTo.length - index // Ensure avatars stack correctly
                                    }}
                                  >
                                    <img
                                      src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=YourSeed=${encodeURIComponent(user.email)}`}
                                      alt={user.name}
                                      style={{ 
                                        width: '20px', 
                                        height: '20px', 
                                        borderRadius: '50%', 
                                        cursor: 'pointer', 
                                        boxShadow: '0 0 2px rgba(0, 0, 0, 0.2)' // Optional: Add a subtle shadow for better visibility
                                      }}
                                      title={user.name} // Tooltip for name
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>  

                            {/* Update and Delete */}
                            <div style={{display:'flex', justifyContent:'end', paddingRight:'20px', gap:'10px'}} >
                                <div  onClick={() => handleDelete(task._id)}><CiTrash color='blue' /></div> 
                                <div  onClick={() => handleUpdate(task._id)}><CiEdit color='blue' /></div>    
                            </div>

                            
                          </div>
                         

                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
}