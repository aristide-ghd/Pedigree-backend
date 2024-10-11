import React, { useState } from 'react';
import axiosInstance from '../services/axiosSetup'; 
import { Form, Button, Container, Alert, Row, Col, Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../styles/ForgotPassword.css'; 

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            await axiosInstance.post('/auth/forgot-password', { email });
            setMessage('Un lien de réinitialisation a été envoyé à votre adresse e-mail.');
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError("L'adresse e-mail n'est pas associée à un compte.");
            } else {
                setError('Une erreur est survenue. Veuillez vérifier votre adresse e-mail.');
            }
        } finally {
            setLoading(false);
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <Container className="bg-gradient-primary d-flex align-items-center justify-content-center vh-100">
            <Row className="justify-content-center w-100">
                <Col xl={12} lg={10} md={10} xxl={12}>
                    <Card className="o-hidden border-0 shadow-lg my-5">
                        <Card.Body className="p-0">
                            <Row>
                                <Col lg={6} className="d-none d-lg-block bg-password-image"></Col>
                                <Col lg={6}>
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-2">Mot de Passe Oublié?</h1>
                                            <p className="mb-4">Nous comprenons, cela arrive. Entrez simplement votre adresse e-mail ci-dessous et nous vous enverrons un lien pour réinitialiser votre mot de passe !</p>
                                        </div>
                                        {message && <Alert variant="success">{message}</Alert>}
                                        {error && <Alert variant="danger">{error}</Alert>}
                                        <Form onSubmit={handleSubmit} className="user">
                                            <Form.Group controlId="email">
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Entrez votre adresse e-mail"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    isInvalid={email && !isValidEmail(email)}
                                                    required
                                                    className='btn-user'
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Veuillez entrer une adresse e-mail valide.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="btn-user btn-block mt-3"
                                                disabled={loading || !isValidEmail(email)}
                                            >
                                                {loading ? <Spinner animation="border" size="sm" /> : 'Réinitialiser le Mot de Passe'}
                                            </Button>
                                        </Form>
                                        <hr />
                                        <div className="text-center">
                                            <a className="small" href="/register">Créer un Compte !</a>
                                        </div>
                                        <div className="text-center">
                                            <a className="small" href="/login">Vous avez déjà un compte ? Connexion !</a>
                                        </div>
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

export default ForgotPassword;