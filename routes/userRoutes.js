const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/authMiddleware');
const {yupValidator} = require('../middleware/yup');
const {addUserDto} = require('../dto/adduserDto');
const {connexionDto} = require('../dto/connexionDto');
const { enregistrerUtilisateur, getTousUtilisateurs, modifierUtilisateurParEmail, connecterUtilisateur, getProfile } = require('../controllers/userController');

// Route pour enregistrer un utilisateur
router.post('/enregistrer', enregistrerUtilisateur);

// Route pour afficher tous les utilisateurs 
router.get('/tous', getTousUtilisateurs);

//Route pour modifier un utilisateur par email
router.put('/modifier/:email', modifierUtilisateurParEmail);

// Route pour connecter un utilisateur 
router.post('/connexion', yupValidator(connexionDto), connecterUtilisateur);

//Route pour afficher le profil d'un utilisateur
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
