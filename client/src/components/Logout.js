import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importer useAuth pour gérer l'état d'authentification

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Utiliser le hook useAuth pour appeler la fonction de déconnexion

  useEffect(() => {
    // Appeler la fonction de déconnexion depuis AuthContext
    logout();

    // Rediriger vers la page de connexion après la déconnexion
    navigate('/login');
  }, [navigate, logout]); // Inclure logout dans les dépendances

  return (
    <div>
      <p>Déconnexion en cours...</p>
    </div>
  );
};

export default Logout;