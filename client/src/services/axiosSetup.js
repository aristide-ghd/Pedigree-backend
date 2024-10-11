import axios from 'axios';

// Créez une instance d'axios
const axiosInstance = axios.create({
  baseURL: 'http://192.168.86.84:5000/api', // URL de base de votre API
  timeout: 5000, // Augmenter le délai d'attente pour les requêtes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajoutez un intercepteur pour inclure le token et l'idUtilisateur dans les requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const idUtilisateur = localStorage.getItem('idUtilisateur'); // Récupérer l'idUtilisateur du stockage local
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (idUtilisateur) {
      config.headers['idUtilisateur'] = idUtilisateur; // Ajouter l'idUtilisateur dans les en-têtes
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gestion des erreurs globales
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Gestion spécifique pour le token expiré
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Redirection vers la page de connexion ou rafraîchissement du token
      localStorage.removeItem('token');
      localStorage.removeItem('idUtilisateur');
      window.location.href = '/login'; // Redirection vers la page de connexion
      return Promise.reject(error);
    }

    console.error('Erreur dans la réponse:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;