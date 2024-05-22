import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../authContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token } = res.data;
      localStorage.setItem('token', token); // Store token in local storage
      login(token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setMessage('Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {message && <div className="message">{message}</div>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
