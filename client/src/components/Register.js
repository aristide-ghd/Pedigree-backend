import React, { useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { useFamily } from '../context/FamilyContext';
import { Link } from 'react-router-dom'; 
import '../styles/sb-admin-2.min.css'; 
import '../styles/Register.css';
import axiosInstance from '../services/axiosSetup';

const Register = ({ onRegister, newFamille }) => {
  const { familyData } = useFamily();
  const [lastName, setLastName] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);  
  const todayISO = new Date().toISOString().split('T')[0];

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Dans le hook useEffect, pour surveiller l'email
  useEffect(() => {
    if (email && !validateEmail(email)) {
      setMessage('Veuillez entrer une adresse email valide.');
      setMessageType('error');
    } else if (messageType === 'error') {
      setMessage('');
    }
  }, [email, messageType]);

  // Validation de mot de passe
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation des champs
    if (!validateEmail(email)) {
      setMessage('Veuillez entrer une adresse email valide.');
      setMessageType('error');
      return;
    }
  
    if (!validatePassword(password)) {
      setMessage('Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.');
      setMessageType('error');
      return;
    }
  
    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      setMessageType('error');
      return;
    }
  
    // Soumission du formulaire
    console.log(familyData.family_name);
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post('/auth/enregistrer', {
        nom: lastName,
        prenom: firstName,
        date_de_naissance: dateNaissance,
        email,
        mot_de_passe: password,
        idFamille: familyData.idFamille,
        newFamille: newFamille,
        fam_exist: familyData.fam_exist,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const { token, idFamille, fam_owner } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('familyId', idFamille);
      localStorage.setItem('isFamOwner', fam_owner);
  
      setMessage('Inscription réussie! Vous serez redirigé vers la page de connexion.');
      setMessageType('success');
      setIsRegistered(true);
  
      if (onRegister) {
        onRegister(true); // Passer true pour indiquer l'inscription réussie
      }
  
      // setTimeout(() => {
      //   window.location.href = '/login';
      // }, 2000);
  
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Gestion de la visibilité des mots de passe
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    const name = familyData.family_name;
    setLastName(name);
  }, [familyData.family_name]);

  return (
    <div className="container">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          <div className="row">
            <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
            <div className="col-lg-7">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h4 text-gray-900 mb-4">Créer un compte !</h1>
                </div>
                {message && (
                  <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
                    {message}
                  </div>
                )}
                {!isRegistered && (
                  <form className="user" onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="text"
                          className="form-control form-control-user"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Prénom *"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="text"
                          className="form-control form-control-user"
                          id="familyName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Nom *"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <input
                        type="date"
                        className="form-control form-control-user"
                        id="familyName"
                        value={dateNaissance}
                        onChange={(e) => setDateNaissance(e.target.value)}
                        max={todayISO}
                        placeholder="Date de naissance *"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="form-group">
                      {/* <label htmlFor="email">Adresse e-mail *</label> */}
                      <input
                        type="email"
                        className={`form-control form-control-user ${!validateEmail(email) && email ? 'is-invalid' : ''}`}
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Adresse e-mail *"
                        required
                        disabled={isSubmitting}
                        autoComplete="email"
                      />
                      {!validateEmail(email) && email && (
                        <div className="invalid-feedback">Veuillez entrer une adresse email valide.</div>
                      )}
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <div className="password-container">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control form-control-user"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mot de passe *"
                            required
                            disabled={isSubmitting}
                            autoComplete="new-password"
                          />
                          <span className="password-toggle" onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="password-container">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="form-control form-control-user"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Répéter le mot de passe *"
                            required
                            disabled={isSubmitting}
                            autoComplete="new-password"
                          />
                          <span className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-user btn-block" disabled={isSubmitting}>
                      {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
                    </button>
                  </form>
                )}
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
                <hr />
                <div className="text-center">
                  <Link className="small" to="/forgot-password">Mot de passe oublié?</Link>
                </div>
                <div className="text-center">
                  <Link className="small" to="/login">Vous avez déjà un compte ? Connectez-vous!</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;