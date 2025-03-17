// components/Notification.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CiTrash } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown

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

  // Delete a single notification
  const handleDeleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted notification from the list
      setNotifications(notifications.filter(n => n._id !== id));

      // Update the unread count
      const unread = notifications.filter(n => !n.read && n._id !== id).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Delete all notifications
  const handleDeleteAllNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5001/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear all notifications
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  // Toggle the dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      {/* Notification Icon */}
      <div
        onClick={toggleDropdown}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <IoIosNotificationsOutline size={24} />
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
          <div style={{ padding: '10px', margin: '0', borderBottom: '1px solid #ccc', fontFamily: 'Iowan Old Style' }}>
            Notifications
          </div>
          {notifications.length === 0 ? (
            <p style={{ padding: '10px', margin: '0', fontFamily: 'Iowan Old Style' }}>No notifications</p>
          ) : (
            <>
              {/* Clear All Button */}
              <div
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #ccc',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f0f0f0',
                  fontFamily: 'Iowan Old Style',
                }}
                onClick={handleDeleteAllNotifications}
              >
                Clear All
              </div>
              {/* Notification List */}
              {notifications.map(notification => (
                <div
                  key={notification._id}
                  style={{
                    padding: '10px',
                    borderBottom: '1px solid #ccc',
                    backgroundColor: notification.read ? '#f9f9f9' : '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingRight: '10px' }}>
                    <div>
                      <p style={{ margin: '0', fontWeight: notification.read ? 'normal' : 'bold' }}>
                        {notification.message}
                      </p>
                      <small style={{ color: '#666' }}>
                        {new Date(notification.createdAt).toLocaleString()}
                      </small>
                    </div>



                   <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>

                   
                    {/* Delete Button */}
                        <div
                          style={{ cursor: 'pointer', textAlign: 'right' }}
                          onClick={() => handleDeleteNotification(notification._id)}
                        >
                          <CiTrash color='blue' />
                        </div>

                                            {/* Mark as Read Button */}
                    {!notification.read && (
                      <button
                        style={{
                          width:'40px',
                          border:'none',
                          backgroundColor: 'transparent',
                          display:'inline-block',
                          cursor: 'pointer',
                          color: 'orange',
                          fontSize: '8px',
                          fontFamily:'Iowan Old Style',
                          
                        }}
                        onClick={() => handleMarkAsRead(notification._id)}
                      >
                        Mark 
                      </button>
                    )}

                        
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;