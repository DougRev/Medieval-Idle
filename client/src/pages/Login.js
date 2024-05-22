import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import { useMessage } from '../messageContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login } = useAuth();
  const { showMessage } = useMessage();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', formData);
      if (res && res.data && res.data.token) {
        login(res.data.token);
        showMessage('Login successful!');
        navigate('/dashboard');
      } else {
        showMessage('Login failed. Please try again.');
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      showMessage('Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="email" name="email" value={email} onChange={onChange} required placeholder="Email" />
      <input type="password" name="password" value={password} onChange={onChange} required placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
