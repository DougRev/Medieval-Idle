import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../authContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [newRole, setNewRole] = useState('');
  
    useEffect(() => {
      const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/users', {
          headers: {
            'x-auth-token': token,
          },
        });
        setUsers(res.data);
      };
  
      fetchUsers();
    }, []);
  
    const handleRoleChange = async (userId) => {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `/api/admin/users/${userId}/role`,
          { role: newRole },
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
        setUsers(users.map(user => (user._id === userId ? { ...user, role: newRole } : user)));
        setEditingUser(null);
        setNewRole('');
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
      }
    };
  
    const handleDelete = async (userId) => {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/admin/users/${userId}`, {
          headers: {
            'x-auth-token': token,
          },
        });
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
      }
    };
  
    const handleResetPassword = async (userId) => {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`/api/admin/users/${userId}/reset-password`, {}, {
          headers: {
            'x-auth-token': token,
          },
        });
        alert('Password reset successfully');
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
      }
    };
  
    return (
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <h2>Manage Users</h2>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => setEditingUser(user._id)}>Edit Role</button>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                  <button onClick={() => handleResetPassword(user._id)}>Reset Password</button>
                  {editingUser === user._id && (
                    <div className="edit-role-form">
                      <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                        <option value="">Select Role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button onClick={() => handleRoleChange(user._id)}>Save</button>
                      <button onClick={() => setEditingUser(null)}>Cancel</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default AdminDashboard;