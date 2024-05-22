import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../messageContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const { addMessage } = useMessage();
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', formData);
      if (res && res.data && res.data.token) {
        addMessage('Registration successful! Please log in.');
        navigate('/login');
      } else {
        addMessage('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      addMessage('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="username" value={username} onChange={onChange} required placeholder="Username" />
      <input type="email" name="email" value={email} onChange={onChange} required placeholder="Email" />
      <input type="password" name="password" value={password} onChange={onChange} required placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
