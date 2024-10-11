import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../services/axiosSetup';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const EditMember = () => {
    const {id} = useParams();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateNaissance, setDateNaissance] = useState('');
    const [pereid, setPereId] = useState('');
    const [mereid, setMereId] = useState('');
    const [isMarried, setIsMarried] = useState('');
    const [gender, setGender] = useState('');
    const [religion, setReligion] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [electrophoresis, setElectrophoresis] = useState('');
    const [message, setMessage] = useState('');
    const [signFa, setSignFA] = useState('');
    const [conjointid, setConjointId] = useState('');
    const [metier, setMetier] = useState('');
    const [members, setMembers] = useState([]);
    const [linkTypes, setLinkTypes] = useState([]);
    const [selectedLinkType, setSelectedLinkType] = useState('');
    const [religionName, setReligionName] = useState('');
    const [originalData, setOriginalData] = useState(null);
    const [userData, setUserData] = useState('');
    const [adminInfo, setAdminInfo] = useState('');
    const todayISO = new Date().toISOString().split('T')[0];
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchData = async () => {
          try {
            const token = localStorage.getItem('token');
            const userResponse = await axiosInstance.get('/utils/profile', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setUserData(userResponse.data.user);        
          } catch (error) {
            console.error('Erreur lors de la récupération des données:', error.response?.data || error.message);
          }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchDataAdmin = async () => {
          try {
            const token = localStorage.getItem('token');
            const Response = await axiosInstance.get('/utils/infos', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setAdminInfo(Response.data);        
          } catch (error) {
            console.error('Erreur lors de la récupération des données de l\'administrateur:', error.response?.data || error.message);
          }
        };
        fetchDataAdmin();
    }, []);

    let isAdmin = false;  
    if (userData?.role === 'ADMIN') isAdmin = true;

    useEffect(() => {
        let isMounted = true; // suivi si le composant est monté
        const fetchData = async () => {
            try {
                const [memberResponse, linkTypesResponse, membersResponse] = await Promise.all([
                    axiosInstance.get(`/user/member/user-info`),
                    axiosInstance.get('/utils/typesDeLien'),
                    axiosInstance.get('/user/member/tous')
                ]);
                if (isMounted) {
                    setOriginalData(memberResponse?.data?.details);
                    setLinkTypes(linkTypesResponse?.data);
                    setMembers(membersResponse?.data);
                    setLastName(memberResponse?.data?.details?.nom || '')
                    setFirstName(memberResponse?.data?.details?.prenom);
                    setDateNaissance( moment(memberResponse?.data?.details?.date_de_naissance).format('YYYY-MM-DD'));
                    setGender(memberResponse?.data?.details?.sexe || '');
                    setPereId(memberResponse?.data?.details?.père?._id);
                    setMereId(memberResponse?.data?.details?.mère?._id);
                    setIsMarried(memberResponse?.data?.details?.statut_matrimonial || '');
                    setConjointId(memberResponse?.data?.details?.conjoint?.id);
                    setReligion(memberResponse?.data?.details?.religion || '');
                    setMetier(memberResponse?.data?.details?.profession || '');
                    setBloodGroup(memberResponse?.data?.details?.groupe_sanguin || '');
                    setElectrophoresis(memberResponse?.data?.details?.electrophorese || '');
                    setSelectedLinkType(memberResponse?.data?.details?.type_de_lien || '');
                    setSignFA(memberResponse?.data?.details?.signe_du_fa || '');
                    setReligionName(memberResponse?.data?.details?.religion_name);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Erreur lors de la récupération des données:', error);
                    setMessage('Erreur lors de la récupération des données.');
                }
            }
        };
        fetchData();
        return () => {
            isMounted = false; // fonction de nettoyage
        };
    }, [id]);
    const updateData = {
        prenom: firstName !== originalData?.prenom ? firstName : undefined,
        nom: lastName !== originalData?.nom ? lastName : undefined,
        date_de_naissance: moment(dateNaissance).format('DD/MM/YYYY') !== moment(originalData?.date_de_naissance).format('DD/MM/YYYY') ? moment(dateNaissance).format('DD/MM/YYYY') : undefined,
        statut_matrimonial: isMarried !== originalData?.statut_matrimonial ? isMarried : undefined,
        sexe: gender !== originalData?.sexe ? gender :undefined,
        religion: religion !== originalData?.religion ? religion : undefined,
        religion_name: religionName !== originalData?.religion_name ? religionName : undefined,
        groupe_sanguin: bloodGroup !== originalData?.groupe_sanguin ? bloodGroup : undefined,
        electrophorese: electrophoresis !== originalData?.electrophorese ? electrophoresis : undefined,
        profession: metier !== originalData?.profession ? metier : undefined,
        id_pere: pereid !== originalData?.père?._id ? pereid : undefined,
        id_mere: mereid !== originalData?.mère?._id ? mereid : undefined,
        id_conjoint: conjointid !== originalData?.conjoint?.id ? conjointid : undefined,
        signe_du_fa: signFa !== originalData?.signe_du_fa ? signFa : undefined,
    };
    const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
    );
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isAdmin 
                    ? `/admin/member/modify-profile-admin` 
                    : `/user/member/modify-profile`;
            await axiosInstance.put(endpoint, filteredData);//route pour modifier les informations de l'utilisateur depuis sont profil
            setMessage('Membre modifié avec succès!');
            toast.success('Ajout réussi! Membre ajouté avec succès.');
            navigate('/home');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
            setMessage(errorMessage);
            console.error('Erreur lors de la mise à jour:', error);
        }
    };
    const handleCancel = () => {
        navigate('/profile');
    };

    return (
        <Container>
            <h2>Modifier les informations</h2>
            {message && <p>{message}</p>}
            {!isAdmin && (
                <fieldset>
                    Vous êtes connecté en tant que membre de la famille. Vous donnerez votre lien en fonction de l'administraateur qui est {adminInfo?.nom} {adminInfo?.prenom}
                </fieldset>
            )}
            {originalData ? (
                <Form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Informations générales</legend>
                        <Row>
                            <Col>
                                <Form.Group controlId="lastName">
                                    <Form.Label>Nom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="firstName">
                                    <Form.Label>Prénom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="gender">
                                    <Form.Label>Sexe</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionner...</option>
                                        <option value="Masculin">Masculin</option>
                                        <option value="Feminin">Feminin</option>
                                        <option value="Autre">Autre</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="dateNaissance">
                                    <Form.Label>Date de naissance</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dateNaissance}
                                        onChange={(e) => setDateNaissance(e.target.value)}
                                        max={todayISO}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </fieldset>
                    <fieldset>
                        <legend>Informations des parents</legend>
                        <Row>
                            <Col>
                                <Form.Group controlId="pereName">
                                    <Form.Label>Père</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={pereid}
                                        onChange={(e) => setPereId(e.target.value)}
                                    >
                                        <option value="">Sélectionner votre père...</option>
                                        {members.map((member) => (
                                            <option key={member._id} value={member._id}>
                                                {member.prenom} {member.nom}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="mereName">
                                    <Form.Label>Mère</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={mereid}
                                        onChange={(e) => setMereId(e.target.value)}
                                    >
                                        <option value="">Sélectionner votre mère...</option>
                                        {members.map((member) => (
                                            <option key={member._id} value={member._id}>
                                                {member.prenom} {member.nom}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        {!isAdmin && <Row>
                            <Col>
                                <Form.Group controlId="selectedLinkType">
                                    <Form.Label>Type de lien</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedLinkType}
                                        onChange={(e) => setSelectedLinkType(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionner un type de lien...</option>
                                        {linkTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>}
                    </fieldset>
                    <fieldset> 
                        <legend>Autres informations</legend>
                        <Form.Group controlId="isMarried">
                            <Form.Label>État matrimonial</Form.Label>
                            <Form.Control
                                as="select"
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
                            </Form.Control>
                        </Form.Group>
                        {isMarried === 'Marie(e)' && (
                            <Form.Group controlId="conjointName">
                                <Form.Label>Nom du conjoint</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={conjointid}
                                    onChange={(e) => setConjointId(e.target.value)}
                                >
                                    <option value="">Sélectionner votre conjoint...</option>
                                     {members.map((member) => (
                                    <option key={member._id} value={member._id}>
                                        {member.prenom} {member.nom}
                                    </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        )}
                        <Form.Group controlId="metier">
                            <Form.Label>Profession</Form.Label>
                            <Form.Control
                                type="text"
                                value={metier}
                                onChange={(e) => setMetier(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="religion">
                            <Form.Label>Religion</Form.Label>
                            <Form.Control
                                as="select"
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
                            </Form.Control>
                        </Form.Group>
                        {religion === 'Autre' && (
                            <Form.Group controlId="nom de religion">
                                <Form.Label>Entrer le nom de votre religion</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={religionName}
                                    onChange={(e) => setReligionName(e.target.value)}
                                />
                            </Form.Group>
                        )}
                        <Form.Group controlId="bloodGroup">
                            <Form.Label>Groupe sanguin</Form.Label>
                            <Form.Control
                                as="select"
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
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="electrophoresis">
                            <Form.Label>Électrophorèse</Form.Label>
                            <Form.Control
                                as="select"
                                value={electrophoresis}
                                onChange={(e) => setElectrophoresis(e.target.value)}
                            >
                                <option value="">Sélectionner...</option>
                                <option value="AA">AA</option>
                                <option value="AS">AS</option>
                                <option value="SC">SC</option>
                                <option value="SS">SS</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="signe du Fa">
                            <Form.Label>Signe du Fâ</Form.Label>
                            <Form.Control
                                type="text"
                                value={signFa}
                                onChange={(e) => setSignFA(e.target.value)}
                            />
                        </Form.Group>
                    </fieldset>
                    <Button variant="primary" type="submit">Modifier</Button>
                    <Button variant="secondary" onClick={handleCancel}>Retour</Button>
                </Form>
            ) : (
                <p>Chargement des données du membre...</p>
            )}
        <ToastContainer/>
        </Container>
    );
};

export default EditMember;