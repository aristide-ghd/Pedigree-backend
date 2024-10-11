import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosSetup';
import { Container, Row, Col, Table, Button, Alert, Spinner } from 'react-bootstrap';
import moment from 'moment';
import useLinkTypes from '../hooks/useLinkTypes';

const MemberDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Pour la navigation
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState('');
    const [error, setError] = useState(null);
    const { loading: linkTypesLoading, error: linkTypesError } = useLinkTypes();

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
          } catch (error) {
            console.error('Erreur lors de la récupération des données:', error.response?.data || error.message);
          }
        };
        fetchData();
    }, []);

    console.log(userData.role);
    let isAdmin = false;  
    if (userData?.role === 'ADMIN') isAdmin = true;
    let isMember = false;
    if (userData?.id_membre !== undefined)
      isMember = true;

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/admin/member/details/${id}`);
                if (isAdmin)
                    setMember(response.data?.data);
                else
                    setMember(response.data?.details);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du membre', error);
                setError('Erreur lors de la récupération des détails du membre.');
            } finally {
                setLoading(false);
            }
        };
        fetchMemberDetails();
    }, [id, isAdmin]);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <p>Chargement des détails du membre...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">
                    {error}
                </Alert>
                <Button variant="primary" onClick={() => navigate('/members-list')}>
                    Retour à la liste des membres
                </Button>
            </Container>
        );
    }

    if (!isMember) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="warning">
                    Membre non trouvé.
                </Alert>
                <Button variant="primary" onClick={() => navigate('/members-list')}>
                    Retour à la liste des membres
                </Button>
            </Container>
        );
    }

    if (linkTypesLoading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <p>Chargement des types de lien...</p>
            </Container>
        );
    }

    if (linkTypesError) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">
                    {linkTypesError}
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h2>Détails du membre</h2>
                    <Table striped bordered hover responsive>
                        <tbody>
                            <tr>
                                <th>Nom</th>
                                <td>{member?.nom || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Prénom</th>
                                <td>{member?.prenom || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Date de naissance</th>
                                <td>{member?.date_de_naissance ? moment(member?.date_de_naissance).format('DD/MM/YYYY') : 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Sexe</th>
                                <td>{member?.sexe || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>État matrimonial</th>
                                <td>{member?.statut_matrimonial || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Père</th>
                                <td>{member?.père ? `${member?.père?.prenom} ${member?.père?.nom}` : 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Mère</th>
                                <td>{member?.mère ? `${member?.mère?.prenom} ${member?.mère?.nom}` : 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Conjoint</th>
                                <td>{member?.conjoint ? `${member?.conjoint?.prenom} ${member?.conjoint?.nom}` : 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Profession</th>
                                <td>{member?.profession || 'Non spécifié'}</td>
                            </tr>
                            {member?.religion !== 'Autre' && (
                                <tr>
                                    <th>Religion</th>
                                    <td>{member?.religion || 'Non spécifié'}</td>
                                </tr>
                            )}
                            {member?.religion === 'Autre' && (
                                <tr>
                                    <th>Religion</th>
                                    <td>{member?.religion_name || 'Non spécifié'}</td>
                                </tr>
                            )}
                            {userData?.id_membre === id && (
                                <tr>
                                    <th>Groupe sanguin</th>
                                    <td>{member?.groupe_sanguin || 'Non spécifié'}</td>
                                </tr>
                            )}
                            {userData?.id_membre === id && (
                                <tr>
                                    <th>Électrophorèse</th>
                                    <td>{member?.electrophorese || 'Non spécifié'}</td>
                                </tr>
                            )}
                            {userData?.id_membre === id && (
                                <tr>
                                    <th>Signe du Fâ</th>
                                    <td>{member?.signe_du_fa || 'Non spécifié'}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <Button variant="primary" onClick={() => navigate(-1)}>Retour</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default MemberDetail;