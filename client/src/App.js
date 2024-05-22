import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './authContext'; 
import { MessageProvider, useMessage } from './messageContext'; 
import ProtectedRoute from './ProtectedRoute';
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <MessageProvider>
          <Navbar />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminRoute />} />
              <Route path="/profile" element={<UserProfile />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
          <Message />
        </MessageProvider>
      </AuthProvider>
    </Router>
  );
};

const AdminRoute = () => {
  const { user, loading } = useAuth(); // useAuth

  if (loading) {
    return <div>Loading...</div>;
  }

  return user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />;
};

const Message = () => {
  const { message } = useMessage(); 
  return message ? <div className="message">{message}</div> : null;
};

export default App;
