import React, { useState } from 'react';
import countries from '../data/countries.json';
import { useFamily } from '../context/FamilyContext';
import axiosInstance from '../services/axiosSetup';
// import '../styles/sb-admin-2.min.css'; // Importation du fichier CSS

const FamilyRegistration = ({ onRegister, onFamilyName, setnewFamille }) => {
  const [family_name, setFamilyName] = useState('');
  const [country, setCountry] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [village, setVillage] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [fieldsDisabled, setFieldsDisabled] = useState(false); // Nouvel état pour désactiver les champs
  const [showLoginLink, setShowLoginLink] = useState(false);
  const { setFamilyData } = useFamily();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsClicked(true);

    try {
      const response = await axiosInstance.post(`auth/create`, {
        family_name,
        country,
        ethnicity,
        village
      });

      const { fam_exist, idFamille } = response?.data;

      if (fam_exist) {
        setMessage('La famille existe déjà ! Vous pouvez maintenant vous inscrire.');
        setMessageType('error');
        onFamilyName(family_name);
        setFamilyData({ family_name, idFamille, fam_exist });
        setShowLoginLink(true);
        if (onRegister) {
          onRegister(true);
        }
      } else {
        setMessage('Famille enregistrée avec succès ! Vous pouvez maintenant vous inscrire.');
        setMessageType('success');
        if (onRegister) {
          onRegister(true);
        }
        setFamilyData({ family_name, idFamille, fam_exist });
        setnewFamille(response.data.newFamille);
        onFamilyName(family_name);
      }
      // Désactiver les champs après l'enregistrement réussi
        setFieldsDisabled(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de l\'enregistrement de la famille.';
      setMessage(errorMessage);
      setMessageType('error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFamilyNameChange = (e) => {
    const newValue = e.target.value;
    if (/^[A-Za-z\s]*$/.test(newValue)) {
      setFamilyName(newValue);
    }
  };

  const handleEthnicityChange = (e) => {
    const newValue = e.target.value;
    if (/^[A-Za-z\s]*$/.test(newValue)) {
      setEthnicity(newValue);
    }
  };

  const handleVillageChange = (e) => {
    const newValue = e.target.value;
    if (/^[A-Za-z\s]*$/.test(newValue)) {
      setVillage(newValue);
    }
  };

  return (
    <div className="container">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          <div className="row">
            <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
            <div className="col-lg-7">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h4 text-gray-900 mb-4">Enregistrement de la Famille</h1>
                </div>
                <form className="user" onSubmit={handleSubmit}>
                  {message && (
                    <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                      {message}
                    </div>
                  )}
                  <div className="form-group row">
                    <div className="col-sm-12 mb-3 mb-sm-0">
                      <input
                        type="text"
                        className="form-control form-control-user"
                        id="familyName"
                        placeholder="Nom de la famille"
                        value={family_name}
                        onChange={handleFamilyNameChange}
                        required
                        disabled={isSubmitting || fieldsDisabled}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <select
                      className="form-select form-control-user"
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      disabled={isSubmitting || fieldsDisabled}
                      autoComplete='country'
                    >
                      <option value="" disabled>Sélectionner le pays</option>
                      {countries.map((country) => (
                        <option key={country.name} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-user"
                      id="ethnicity"
                      placeholder="Ethnicité"
                      value={ethnicity}
                      onChange={handleEthnicityChange}
                      required
                      disabled={isSubmitting || fieldsDisabled}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-user"
                      id="village"
                      placeholder="Village"
                      value={village}
                      onChange={handleVillageChange}
                      required
                      disabled={isSubmitting || fieldsDisabled}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-user btn-block"
                    disabled={isSubmitting || isClicked}
                  >
                    {isSubmitting ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      'Enregistrer la famille'
                    )}
                  </button>
                </form>
                {showLoginLink && (
                  <div className="text-center mt-2">
                    <a className="small" href="/login">Vous avez déjà un compte ? Se connecter</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyRegistration;