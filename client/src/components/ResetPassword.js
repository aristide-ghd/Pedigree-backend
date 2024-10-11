import React, { useState } from 'react';
import axiosInstance from '../services/axiosSetup';
import { Form, Button, Container, Alert, Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assurez-vous que Bootstrap CSS est importé
import '../styles/ForgotPassword.css'; // Importation du fichier CSS spécifique si nécessaire

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            await axiosInstance.post('/auth/reset-password', { token, password });
            setMessage('Votre mot de passe a été réinitialisé avec succès.');
        } catch (err) {
            setError('Une erreur est survenue lors de la réinitialisation de votre mot de passe.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };


    return (
        <Container className="bg-gradient-primary d-flex align-items-center justify-content-center vh-100">
            <Row className="justify-content-center w-100">
                <Col xl={10} lg={12} md={9}>
                    <Card className="o-hidden border-0 shadow-lg my-5">
                        <Card.Body className="p-0">
                            <Row>
                                <Col lg={6} className="d-none d-lg-block bg-password-image"></Col>
                                <Col lg={6}>
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Réinitialiser le Mot de Passe</h1>
                                            <p className="mb-4">Entrez et confirmez votre nouveau mot de passe ci-dessous.</p>
                                        </div>
                                        {message && <Alert variant="success">{message}</Alert>}
                                        {error && <Alert variant="danger">{error}</Alert>}
                                        <Form onSubmit={handleSubmit} className="user">
                                            <Form.Group controlId="password">
                                                <Form.Label>Nouveau mot de passe :</Form.Label>
                                                <div className="password-wrapper">
                                                    <Form.Control
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        className="btn-user"
                                                        autoComplete='new-password'
                                                    />
                                                    <span className="password-toggle" onClick={togglePasswordVisibility}>
                                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                    </span>
                                                </div>
                                            </Form.Group>
                                            <Form.Group controlId="confirmPassword">
                                                <Form.Label>Confirmer le mot de passe :</Form.Label>
                                                <div className="password-wrapper">
                                                    <Form.Control
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                        className="btn-user"
                                                        autoComplete='new-password'
                                                    />
                                                    <span className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                                                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                                    </span>
                                                </div>
                                            </Form.Group>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="btn-user btn-block"
                                                disabled={loading}
                                            >
                                                {loading ? 'Réinitialisation en cours...' : 'Réinitialiser'}
                                            </Button>
                                        </Form>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPassword;