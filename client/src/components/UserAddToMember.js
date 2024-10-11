import React, { useState, useEffect } from 'react';
import { Spinner, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosSetup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const UserMember = () => {
    const [userData, setUserData] = useState('');
    const [dateNaissance, setDateNaissance] = useState('');
    const [pereName, setPereName] = useState();
    const [mereName, setMereName] = useState();
    const [isMarried, setIsMarried] = useState('');
    const [gender, setGender] = useState('');
    const [religion, setReligion] = useState('');
    const [religionName, setReligionName] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [electrophoresis, setElectrophoresis] = useState('');
    const [signFa, setSignFA] = useState('');
    const [conjointName, setConjointName] = useState();
    const [metier, setMetier] = useState('');
    const [linkTypes, setLinkTypes] = useState([]);
    const [selectedLinkType, setSelectedLinkType] = useState('');
    const [members, setMembers] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [adminInfo, setAdminInfo] = useState(null);
    const navigate = useNavigate(); 
    const todayISO = new Date().toISOString().split('T')[0];
    let isAdmin = false;

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axiosInstance.get('/user/member/tous');
                setMembers(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des membres', error);
            }
        };
        fetchMembers();
    }, []);

    useEffect(() => {
        const fetchLinkTypes = async () => {
            try {
                const response = await axiosInstance.get('/utils/typesDeLien');
                setLinkTypes(response.data);
            } catch (error) {
                console.log('Erreur lors de la récupération des types de liens:', error);
            }
        };
        fetchLinkTypes();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userResponse = await axiosInstance.get('/utils/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData(userResponse?.data?.user);
                setDateNaissance(moment(userData?.date_de_naissance).format('YYYY-MM-DD'));
                if (userData?.role !== 'ADMIN') {
                    const adminResponse = await axiosInstance.get('/utils/infos', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setAdminInfo(adminResponse.data);
                }
                
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error.response?.data || error.message);
            }
        };
        fetchData();
    }, [userData?.role, userData?.date_de_naissance]);
    
    isAdmin = userData?.role === 'ADMIN' ? true : false;

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            prenom: userData?.prenom,
            nom: userData?.nom,
            date_de_naissance: dateNaissance,
            id_pere: pereName,
            id_mere: mereName,
            statut_matrimonial: isMarried,
            sexe: gender,
            religion,
            religion_name: religionName,
            groupe_sanguin: bloodGroup,
            electrophorese: electrophoresis,
            signe_du_fa: signFa,
            id_conjoint: conjointName,
            profession: metier
        };
        payload.type_de_lien = userData?.role !== 'ADMIN' ? selectedLinkType : payload.type_de_lien;
    
        try {
            const token = localStorage.getItem('token');
            const endpoint = isAdmin 
                    ? `/admin/member/new-member` 
                    : `/user/member/new-member`;
            const response = await axiosInstance.post(endpoint, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            console.log('Réponse du serveur:', response);
    
            setMessage('Ajout réussie! Votre profil a été modifier avec succès.');
            toast.success('Ajout réussi! Votre profil a été modifier avec succès.');
            resetForm();
            setTimeout(() => navigate('/home'), 3000); // Rediriger après l'ajout réussi
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Une erreur est survenue';
            if (errorMessage === 'Cette personne est déja membre de la famille') {
                toast.error('Vous êtes déja membre de la famille. Vous pouvez aller modifier vos informations au niveau de votre profile');
                setMessage('Vous êtes déja membre de la famille. Vous pouvez aller modifier vos informations au niveau de votre profile');
                setLoading(false);
                setTimeout(() => navigate('/profile'), 2000)
                return;
            }
            setMessage(errorMessage);
            toast.error(errorMessage);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        if (window.confirm('Êtes-vous sûr de vouloir annuler ? Toutes les modifications non enregistrées seront perdues.')) {
            resetForm();
            navigate('/home');
        }
    };

    const resetForm = () => {
        setDateNaissance('');
        setPereName();
        setMereName();
        setIsMarried('');
        setGender('');
        setReligion('');
        setBloodGroup('');
        setElectrophoresis('');
        setSignFA('');
        setConjointName();
        setSelectedLinkType('');
        setMetier('');
        setMessage('');
    };
    console.log(moment(userData?.date_de_naissance).format('DD/MM/YYYY'));

    return (
        <div className="register-member-container"> 
            <h2>Complétez vos informations</h2>
            {message && <p>{message}</p>}
            {loading && <Spinner animation="border" />}
            {!isAdmin && adminInfo && (
                <Alert variant="info">
                    <p>Vous êtes connecté en tant qu'utilisateur. Voici les informations de l'administrateur {adminInfo.nom} {adminInfo.prenom}.</p>
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Informations générales</legend>
                    <div>
                        <label>Nom :</label>
                        <input
                            type="text"
                            value={userData?.nom}
                            required
                            readOnly
                        />
                    </div>
                    <div>
                        <label>Prénom :</label>
                        <input
                            type="text"
                            value={userData?.prenom}
                            required
                            readOnly
                        />
                    </div>
                    <div>
                        <label>Sexe :</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="">Sélectionner...</option>
                            <option value="Masculin">Masculin</option>
                            <option value="Feminin">Féminin</option>
                        </select>
                    </div>
                    <div>
                        <label>Date de naissance :</label>
                        <input
                            type="date"
                            value={dateNaissance}
                            onChange={(e) => setDateNaissance(e.target.value)}
                            max={todayISO}
                            required
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Informations des parents :</legend>
                    <div>
                        <label>Père:</label>
                        <select
                            value={pereName}
                            onChange={(e) => setPereName(e.target.value)}
                        >
                            <option value="">Sélectionner un membre...</option>
                            {members?.map((member) => (
                                <option key={member._id} value={member._id}>
                                    {member.prenom} {member.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Mère:</label>
                        <select
                            value={mereName}
                            onChange={(e) => setMereName(e.target.value)}
                        >
                            <option value="">Sélectionner un membre...</option>
                            {members?.map((member) => (
                                <option key={member._id} value={member._id}>
                                    {member.prenom} {member.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Autres informations</legend>
                    {userData?.role !== 'ADMIN' && (
                        <Form.Group>
                            <Form.Label>Type de lien :</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedLinkType}
                                onChange={(e) => setSelectedLinkType(e.target.value)}
                            >
                                <option value="">Sélectionner un type de lien...</option>
                                {linkTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    )}
                    <div>
                        <label>État matrimonial :</label>
                        <select
                            value={isMarried}
                            onChange={(e) => setIsMarried(e.target.value)}
                            required
                        >
                            <option value="">Sélectionner...</option>
                            <option value="Marie(e)">Marie(e)</option>
                            <option value="Celibataire">Celibataire</option>
                            <option value="Divorce(e)">Divorce(e)</option>
                            <option value="Concubinage">Concubinage</option>
                            <option value="Veuf(ve)">Veuf(ve)</option>
                        </select>
                    </div>
                    {isMarried === 'Marie(e)' && (
                        <div>
                            <label>Nom du conjoint :</label>
                            <select
                                value={conjointName}
                                onChange={(e) => setConjointName(e.target.value)}
                            >
                                <option value="">Sélectionner un membre...</option>
                            {members?.map((member) => (
                                <option key={member._id} value={member._id}>
                                    {member.prenom} {member.nom}
                                </option>
                            ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <label>Profession :</label>
                        <input
                            type="text"
                            value={metier}
                            onChange={(e) => setMetier(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Religion :</label>
                        <select
                            value={religion}
                            onChange={(e) => setReligion(e.target.value)}
                        >
                            <option value="">Sélectionner...</option>
                            <option value="Vodouisme">Vodouisme</option>
                            <option value="Christianisme">Christianisme</option>
                            <option value="Islam">Islam</option>
                            <option value="Hindouisme">Hindouisme</option>
                            <option value="Bouddhisme">Bouddhisme</option>
                            <option value="Judaisme">Judaïsme</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                    {religion === 'Autre' && (
                        <div>
                        <label>Entrer votre religion :</label>
                        <input
                            type="text"
                            value={religionName}
                            onChange={(e) => setReligionName(e.target.value)}
                        />
                        </div>
                    )}
                    <div>
                        <label>Groupe sanguin :</label>
                        <select
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                        >
                            <option value="">Sélectionner...</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                    <div>
                        <label>Signe du Fâ :</label>
                        <input
                            type="text"
                            value={signFa}
                            onChange={(e) => setSignFA(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Électrophorèse :</label>
                        <select
                            value={electrophoresis}
                            onChange={(e) => setElectrophoresis(e.target.value)}
                        >
                            <option value="">Sélectionner...</option>
                            <option value="AA">AA</option>
                            <option value="AS">AS</option>
                            <option value="SC">SC</option>
                            <option value="SS">SS</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                </fieldset>
                <div className="form-buttons">
                <button type="submit">Ajouter</button>
                <button type="button" onClick={handleCancel}>Annuler</button>
            </div>
        </form>
        <ToastContainer />
    </div>
);
};

export default UserMember;
