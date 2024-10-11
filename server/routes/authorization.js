const express = require('express');
const router = express.Router();
const {yupValidator} = require('../middleware/yup');
const {connexionDto} = require('../dto/connexionDto');
const { enregistrerUtilisateur, connecterUtilisateur } = require('../controllers/userController');
const {add_familyDto} = require('../dto/add_familyDto.js');
const {create_family} = require('../controllers/family_controller.js');
const { addUserDto } = require('../dto/adduserDto.js');

// Route pour enregistrer un utilisateur
router.post('/enregistrer', yupValidator(addUserDto), enregistrerUtilisateur);

// Route pour connecter un utilisateur 
router.post('/connexion', yupValidator(connexionDto), connecterUtilisateur);

//Route pour créer une nouvelle famille
router.post('/create', yupValidator(add_familyDto), create_family);

module.exports = router;
