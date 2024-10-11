import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosSetup';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    tokenExpiration: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axiosInstance.get(`/utils/All-Permision`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const { user, fam_owner } = response.data;
          setUser(user);
          setRole(fam_owner ? 'ADMIN' : 'USER');
          setAuthState({
            isAuthenticated: true,
            token,
          });

          const memberResponse = await axiosInstance.get(`/user/member/tous`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsMember(memberResponse.data.isMember);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur', error);
        // setError('Erreur lors de la récupération de l\'utilisateur.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(`/auth/connexion`, credentials);
      const token = response.data?.data?.token;
      const user = response.data?.utilisateur;
      localStorage.setItem('token', token);
      setUser(user);
      setRole(user?.role);

      const memberResponse = await axiosInstance.get(`/user/member/tous`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsMember(memberResponse.data.isMember);
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      setError('Erreur lors de la connexion. Veuillez vérifier vos informations.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setRole(null);
    setIsMember(false);
  };

  return (
    <AuthContext.Provider value={{ authState, user, role, isMember, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};