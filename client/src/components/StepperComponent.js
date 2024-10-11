import React, { useState } from 'react';
import { Nav, Tab, Button, ProgressBar, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FamilyRegistration from './FamilyRegistration';
import Register from './Register';
import Login from './Login';
import '../styles/StepperComponent.css';

const steps = ['Enregistrement de la Famille', 'Inscription', 'Connexion'];

const StepperComponent = () => {
  const [step, setStep] = useState(1);
  const [isFamilyRegistered, setIsFamilyRegistered] = useState(false);
  const [isMemberRegistered, setIsMemberRegistered] = useState(false);
  const [familyName, setFamilyName] = useState(''); // État pour stocker le nom de famille
  const [newFamille, setnewFamille] = useState(); // État pour stocker l'objet famille

  const handleNext = () => {
    if (step === 1 && isFamilyRegistered) {
      setStep(2);
    } else if (step === 2 && isMemberRegistered) {
      setStep(3);
    } else if (step === 3) {
      // Optionally handle completion here
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setIsFamilyRegistered(false);
    setIsMemberRegistered(false);
    setFamilyName(''); // Réinitialiser le nom de famille
    setnewFamille(null); // Réinitialiser l'objet famille
  };

  const getProgress = () => (step / steps.length) * 100;

  return (
    <Container fluid className="stepper-container mt-4">
      <h2 className="text-center mb-4">Étapes d'Inscription</h2>
      <ProgressBar
        now={getProgress()}
        label={`${getProgress()}%`}
        className="mb-4"
        variant="success"
      />

      <Tab.Container id="left-tabs-example" activeKey={step.toString()}>
        <Nav variant="tabs" className="mb-4">
          {steps.map((label, index) => (
            <Nav.Item key={index} className="flex-fill">
              <Nav.Link
                eventKey={(index + 1).toString()}
                className={step === index + 1 ? 'active-step' : ''}
              >
                {label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="1">
          <FamilyRegistration
              onRegister={(success, familyObject) => {
                if (success) {
                  setIsFamilyRegistered(true);
                  setnewFamille(familyObject); // Stocker l'objet famille
                  handleNext();
                } else {
                  setIsFamilyRegistered(false);
                }
              }}
              onFamilyName={(name) => setFamilyName(name)} // Conserver le nom de famille
              setnewFamille={setnewFamille} // Passer la fonction setnewFamille comme prop
            />
            {!isFamilyRegistered && (
              <p className="text-warning text-center">Veuillez compléter l'enregistrement de la famille pour continuer.</p>
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="2">
            <Register 
              familyName={familyName} 
              newFamille={newFamille} 
              onRegister={(success) => {
                if (success) {
                  setIsMemberRegistered(true);
                  handleNext();
                } else {
                  setIsMemberRegistered(false);
                }
              }} 
            />
            {!isMemberRegistered && (
              <p className="text-warning text-center">Veuillez compléter l'inscription pour continuer.</p>
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="3">
            <Login />
          </Tab.Pane>
        </Tab.Content>

        <div className="d-flex justify-content-between mt-3">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={step === 1}
            className="me-2"
          >
            <i className="bi bi-arrow-left"></i> Précédent
          </Button>
          {step === steps.length ? (
            <Button variant="success" onClick={handleReset}>
              Réinitialiser <i className="bi bi-arrow-clockwise"></i>
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={(step === 1 && !isFamilyRegistered) || (step === 2 && !isMemberRegistered)}
            >
              Suivant <i className="bi bi-arrow-right"></i>
            </Button>
          )}
        </div>
      </Tab.Container>
    </Container>
  );
};

export default StepperComponent;