import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../authContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditUsername, setShowEditUsername] = useState(false);
  const [username, setUsername] = useState(user ? user.username : '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const onChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    try {
      const res = await axios.put('/api/auth/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response.data.msg || 'Error changing password. Please try again.');
    }
  };

  const onEditUsername = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put('/api/auth/edit-username', {
        username,
      }, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      setMessage(res.data.msg);
      setShowEditUsername(false);
    } catch (err) {
      setMessage(err.response.data.msg || 'Error updating username. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {message && <p className="message">{message}</p>}
      <div className="profile-info">
        <h3>{username}</h3>
        <button onClick={() => setShowEditUsername(!showEditUsername)}>Edit Username</button>
        {showEditUsername && (
          <form className="form-section" onSubmit={onEditUsername}>
            <div>
              <label>New Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit">Update Username</button>
              <button id='cancel-btn' type="button" onClick={() => setShowEditUsername(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
      <br/> 
      <div className="password-section">
        <button onClick={() => setShowChangePassword(!showChangePassword)}>Change Password</button>
        {showChangePassword && (
          <form className="form-section" onSubmit={onChangePassword}>
            <div>
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit">Change Password</button>
              <button id='cancel-btn' type="button" onClick={() => setShowChangePassword(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
