// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (!role) {
  //   return <Navigate to="/login" />;
  // }

  return children;
};

export default PrivateRoute;