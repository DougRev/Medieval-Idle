import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  // Destructure jwtDecode from jwt-decode module
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          const res = await axios.get('/api/auth/user', {
            headers: {
              'x-auth-token': token,
            },
          });
          setUser(res.data);
        }
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    const res = await axios.get('/api/auth/user', {
      headers: {
        'x-auth-token': token,
      },
    });
    setUser(res.data);
    navigate('/dashboard'); // Redirect to dashboard after login
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
