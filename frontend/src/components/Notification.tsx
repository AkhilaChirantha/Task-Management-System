import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [navigate]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map(notification => (
        <div key={notification._id} style={{ backgroundColor: notification.read ? '#f0f0f0' : '#ffffff', padding: '10px', margin: '10px', border: '1px solid #ccc' }}>
          <p>{notification.message}</p>
          {!notification.read && (
            <button onClick={() => handleMarkAsRead(notification._id)}>Mark as Read</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent;