const express = require('express');
const router = express.Router();
const { enregistrerUtilisateur, getTousUtilisateurs, modifierUtilisateurParEmail, connecterUtilisateur } = require('../controllers/userController');

// Route pour enregistrer un utilisateur
router.post('/enregistrer', enregistrerUtilisateur);

// Route pour afficher tous les utilisateurs
router.get('/tous', getTousUtilisateurs);

//Route pour modifier un utilisateur par email
router.put('/modifier/:email', modifierUtilisateurParEmail);

// Route pour connecter un utilisateur 
router.post('/connexion', connecterUtilisateur);

module.exports = router;
