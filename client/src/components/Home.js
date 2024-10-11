import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Alert, NavDropdown, Spinner, Modal, Form, FormControl } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';
import axiosInstance from '../services/axiosSetup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const {authstate, role, logout, user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userResponse = await axiosInstance.get('/utils/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserData(userResponse.data.user);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.response?.data || error.message);
        setError('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" role="status">
          <span className="sr-only">Chargement en cours...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Erreur : {error}</Alert>;
  }

  let isMember = false;
  if (userData.id_membre !== undefined)
    isMember = true;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar bg-gradient-primary sidebar-dark">
        <Navbar.Brand href="#" className="sidebar-brand d-flex align-items-center justify-content-center">
          <div className="sidebar-brand-icon">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className="sidebar-brand-text mx-3">Gestion des Membres</div>
        </Navbar.Brand>
        <Nav className="flex-column">
          <Nav.Item>
            <Nav.Link as={Link} to="/dashboard">
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/add-member">
              <i className="fas fa-fw fa-user-plus"></i>
              <span>Ajouter un Membre</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/members-list">
              <i className="fas fa-fw fa-users"></i>
              <span>Liste des Membres</span>
            </Nav.Link>
          </Nav.Item>
          {/* Ajoutez d'autres éléments de navigation ici */}
        </Nav>
      </div>

      {/* Content Wrapper */}
      <div className="content-wrapper">
        {/* Topbar */}
        <Navbar bg="light" expand="lg" className="topbar mb-4 static-top shadow">
        <Form inline className="navbar-search">
          <FormControl type="text" placeholder="Search..." className="form-control mr-sm-2" />
          <Button variant="outline-success" className="btn d-flex align-items-center justify-content-center">
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </Form>

          <Nav className="ml-auto">
            <NavDropdown
              alignRight
              title={
                <>
                  <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                    {user ? userData?.nom : 'Nom Utilisateur'}
                  </span>
                  <img
                    className="img-profile rounded-circle"
                    src={userData?.profilePicture || "/img/undraw_profile.svg"}
                    alt="Profile"
                  />
                </>
              }
              id="userDropdown"
            >
              <NavDropdown.Item as={Link} to="/profile">
                Profil
              </NavDropdown.Item>
              {role === 'ADMIN' && (
                <NavDropdown.Item as={Link} to="/settings">
                  Paramètres
                </NavDropdown.Item>
              )}
              <NavDropdown.Item onClick={handleLogout}>
                Déconnexion
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar>

        {!isMember && (
          <Alert variant="warning" className="mt-3">
            Vous n'avez pas encore complété votre ajout en tant que membre. <Link to="/user-member">Complétez votre profil ici</Link>.
          </Alert>
        )}

        {/* Main Content */}
        <main className="main-content">
          <Container>
            <section className="home-section">
              <h1>Bienvenue {userData?.nom} sur Pedigree!</h1>
              <p>Une application pour gérer les membres de votre famille et vos amis proches.</p>
              <div className="home-buttons">
                {role === 'ADMIN' && (
                  <>
                    <Button as={Link} to="/add-member" className="home-button" variant="primary">Ajouter un Membre de la Famille</Button>
                    <Button as={Link} to="/add-friend" className="home-button" variant="primary">Ajouter un Ami Proche</Button>
                  </>
                )}
                <Button as={Link} to="/members-list" className="home-button" variant="primary">Liste des Membres</Button>
                <Button as={Link} to="/family-diagram" className="home-button" variant="primary">Arbre Généré</Button>
                <Button onClick={handleLogout} className="home-button home-button-quit" variant="danger">Quitter</Button>
              </div>
            </section>
          </Container>
        </main>

        <footer className="sticky-footer">
          <div className="footer-container">
            <span>&copy; Gestion de la Famille 2024</span>
          </div>
        </footer>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={cancelLogout}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la Déconnexion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir vous déconnecter ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelLogout}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmLogout}>
            Déconnexion
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;