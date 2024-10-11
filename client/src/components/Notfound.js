// src/components/NotFound.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const NotFound = () => {
  return (
    <Container className="text-center mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="error mx-auto" data-text="404">404</div>
          <h2 className="display-4">Page Non Trouvée</h2>
          <p className="lead text-gray-800 mb-5">Désolé, la page que vous recherchez n'existe pas.</p>
          <Link to="/login">
            <Button variant="primary">Retour</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;