// src/components/RoleBasedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Affichez un chargement pendant que les données sont récupérées
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />; // Redirige vers une page non autorisée si le rôle ne correspond pas
  }

  return children;
};

export default RoleBasedRoute;