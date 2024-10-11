import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/sb-admin-2.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const {authstate, login, user, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ou 'danger'
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setMessageType('success');
      setMessage('Connexion réussie ! Vous serez redirigé vers la page d\'accueil.');
      setTimeout(() => navigate('/home'), 3000); // Redirection après 3 secondes
    }
  }, [user, authstate, navigate]);

  useEffect(() => {
    if (error) {
      setMessageType('danger');
      // Vous pouvez personnaliser le message d'erreur ici
      if (error.includes('email')) {
        setMessage('L\'adresse email que vous avez entrée n\'existe pas.');
      } else if (error.includes('password')) {
        setMessage('Le mot de passe est incorrect.');
      } else {
        setMessage(error); // Affiche le message d'erreur général
      }
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, mot_de_passe: password });
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-gradient-primary">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-10 col-md-10 col-lg-8 col-xl-12">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                  <div className="col-lg-6">
                    <div className="p-4 p-md-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Bienvenue!</h1>
                      </div>
                      {message && (
                        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
                          {message}
                        </div>
                      )}
                      <form className="user" onSubmit={handleSubmit}>
                        <div className="form-group">
                          <input
                            type="email"
                            className={`form-control form-control-user`}
                            placeholder="Entrez votre adresse email *"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <div className="password-wrapper">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className={`form-control form-control-user`}
                              placeholder="Mot de passe *"
                              autoComplete="current-password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                            <span className="password-toggle" onClick={togglePasswordVisibility}>
                              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="custom-control custom-checkbox small">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck"
                            />
                            <label className="custom-control-label" htmlFor="customCheck">
                              Se souvenir de moi
                            </label>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary btn-user btn-block"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                        <hr />
                        <button
                          type="button"
                          className="btn btn-google btn-user btn-block"
                          onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`}
                        >
                          <FontAwesomeIcon icon={faGoogle} className="fa-fw" /> Se connecter avec Google
                        </button>
                        <button
                          type="button"
                          className="btn btn-facebook btn-user btn-block"
                          onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/facebook`}
                        >
                          <FontAwesomeIcon icon={faFacebookF} className="fa-fw" /> Se connecter avec Facebook
                        </button>
                      </form>
                      <hr />
                      <div className="text-center">
                        <Link className="small" to="/forgot-password">
                          Mot de passe oublié ?
                        </Link>
                      </div>
                      <div className="text-center">
                        <Link className="small" to="/register">
                          Créer un compte !
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;