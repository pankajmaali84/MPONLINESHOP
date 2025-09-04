import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired, getRoleFromToken } from '../utils/auth';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = getRoleFromToken(token);

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }
  if (role !== 'admin') {
    return <Navigate to="/home" replace />;
  }
  return children;
};

export default AdminRoute;
