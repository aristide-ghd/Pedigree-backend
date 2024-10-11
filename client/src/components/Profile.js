import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Alert, Card, Form, Spinner, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosSetup';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // const [confirmAction, setConfirmAction] = useState(() => () => {});
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
        setFormData({
          email: userResponse.data.user?.email || '',
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.response?.data || error.message);
        setError('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmModal(false);
    setEditMode(false);
    setSuccessMessage('');
    setError(null);
    setFormData({
      email: userData?.email || '',
    });
  };

  const handleRejectCancel = () => {
    setShowConfirmModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(`/utilisateurs/modifier/${userData.user?.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserData(prevState => ({
        ...prevState,
        email: formData.email
      }));
      setSuccessMessage('Email mis à jour avec succès.');
      setEditMode(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données utilisateur:', error.response?.data || error.message);
      setError('Erreur lors de la mise à jour des données utilisateur.');
    }
  };

  const handleBack = () => navigate('/home');
  const  handleClick = () => navigate('/user-detail/edit');

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Chargement des données du profil...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header as="h2">Profil de l'Utilisateur</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              {userData && (
                <>
                  <p><strong>Nom :</strong> {userData?.nom || 'Non spécifié'}</p>
                  <p><strong>Prénom :</strong> {userData?.prenom}</p>
                  <p><strong>Email :</strong> {userData?.email}</p>
                  <p><strong>Rôle :</strong> {userData?.role}</p>
                  {editMode ? (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group controlId="formEmail">
                        <Form.Label>Email :</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {error && 'Veuillez entrer un email valide.'}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <div className="d-flex justify-content-between">
                        <Button variant="primary" type="submit">
                          Enregistrer
                        </Button>
                        <Button variant="secondary" onClick={handleCancel}>
                          Annuler
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <div className="d-flex justify-content-between">
                      <Button variant="primary" onClick={handleEdit}>
                        Modifier mon email
                      </Button>
                      <Button variant="primary" onClick={handleClick}>
                        Modifier mes informations personnelles
                      </Button>
                      <Button variant="secondary" onClick={handleBack}>
                        Retour
                      </Button>
                    </div>
                  )
                  }
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de confirmation */}
      <Modal show={showConfirmModal} onHide={handleRejectCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir annuler les modifications ? Vos modifications non sauvegardées seront perdues.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRejectCancel}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleConfirmCancel}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;