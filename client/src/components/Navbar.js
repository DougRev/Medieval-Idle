import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../authContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <h1>Medieval Kingdom Idle Game</h1>
      <ul>
        {user ? (
          <>
            <li>Welcome, {user.username}</li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
