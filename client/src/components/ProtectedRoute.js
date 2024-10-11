// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importer le contexte d'authentification

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Utiliser le contexte pour obtenir les informations d'authentification

  // Pendant le chargement initial, ne pas rediriger pour éviter les comportements indésirables
  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;