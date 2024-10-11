// src/components/RedirectIfVisited.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectIfVisited = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà visité l'application
    const hasVisited = localStorage.getItem('hasVisited');

    if (hasVisited) {
      // Rediriger vers la page de connexion si l'utilisateur a déjà visité
      navigate('/login');
    }
  }, [navigate]);

  return null; // Ce composant ne rend rien
};

export default RedirectIfVisited;