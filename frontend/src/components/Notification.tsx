import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch notifications
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

        // Calculate unread notifications
        const unread = response.data.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [navigate]);

  // Mark a notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the notification list
      const updatedNotifications = notifications.map(n =>
        n._id === id ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifications);

      // Update the unread count
      setUnreadCount(unreadCount - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Toggle the dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Notification Icon */}
      <div
        onClick={toggleDropdown}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <FaBell size={24} />
        {/* Show unread count */}
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '12px',
            }}
          >
            {unreadCount}
          </span>
        )}
      </div>

      {/* Notification Dropdown */}
      {isDropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '0',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            width: '300px',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          <h3 style={{ padding: '10px', margin: '0', borderBottom: '1px solid #ccc' }}>
            Notifications
          </h3>
          {notifications.length === 0 ? (
            <p style={{ padding: '10px', margin: '0' }}>No notifications</p>
          ) : (
            notifications.map(notification => (
              <div
                key={notification._id}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #ccc',
                  backgroundColor: notification.read ? '#f9f9f9' : '#ffffff',
                }}
                onClick={() => handleMarkAsRead(notification._id)}
              >
                <p style={{ margin: '0', fontWeight: notification.read ? 'normal' : 'bold' }}>
                  {notification.message}
                </p>
                <small style={{ color: '#666' }}>
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;