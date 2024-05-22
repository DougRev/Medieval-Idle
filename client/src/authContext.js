import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('/api/auth/user', {
            headers: {
              'x-auth-token': token,
            },
          });
          setUser(res.data);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const fetchUser = async () => {
      const res = await axios.get('/api/auth/user', {
        headers: {
          'x-auth-token': token,
        },
      });
      setUser(res.data);
    };
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
