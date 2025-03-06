import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function TaskList() {
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const navigate = useNavigate();

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

  const handleDelete = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleUpdate = (taskId: string) => {
    navigate(`/tasks/update/${taskId}`);
  };

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

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        {['To do', 'In Progress', 'Done'].map((status, index) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  width: '30%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
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
                        style={{
                          padding: '10px',
                          margin: '5px 0',
                          backgroundColor: '#fff',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          ...provided.draggableProps.style
                        }}
                      >
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <p>Priority: {task.priority}</p>
                        <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                        <div>
                          <p>Assigned To:</p>
                          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                            {task.assignedTo.map((user: any) => (
                              <div key={user._id} style={{ position: 'relative', textAlign: 'center' }}>
                                <img
                                  src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=YourSeed=${encodeURIComponent(user.email)}`}
                                  alt={user.name}
                                  style={{ width: '30px', height: '30px', borderRadius: '50%' , cursor: 'pointer', border:'1px solid black'}}
                                  title={user.name} // Tooltip for name
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p>Created By:</p>
                          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                            <img
                              src={task.createdBy.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=YourSeed=${encodeURIComponent(task.createdBy.email)}`}
                              alt={task.createdBy.name}
                              style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                              title={task.createdBy.name} // Tooltip for name
                            />
                          </div>
                        </div>
                        <button onClick={() => handleUpdate(task._id)}>Update</button>
                        <button onClick={() => handleDelete(task._id)}>Delete</button>
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
  );
}