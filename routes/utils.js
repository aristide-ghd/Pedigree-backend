const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { send_permission_log} =  require("../controllers/RoleController.js");
const { getTousUtilisateurs, modifierUtilisateurParEmail, getProfile } = require('../controllers/userController');
const { get_family_list, } = require('../controllers/family_controller.js');
const { getMembreParSexe } = require('../controllers/membreController');
const {getTypesDeLien} = require('../controllers/lienController');

//route pour afficher les infos concernant les permissions des deux roles
router.get('/All-Permision', send_permission_log);

// Route pour afficher tous les utilisateurs 
router.get('/All-accounts', getTousUtilisateurs);

//Route pour aficher la list des familles enrégistrer
router.get('/familyList', get_family_list);

//Route pour afficher le profil d'un utilisateur
router.get('/profile', authMiddleware, getProfile);

//Route pour modifier un utilisateur par email
router.put('/modifier/:email', modifierUtilisateurParEmail);

//Route pour récuperer les types de lien
router.get('/typesDeLien', getTypesDeLien);

//Route pour recupérer les membres par sexe pour un utilisateur
router.get('/recuperer/:sexe', authMiddleware, getMembreParSexe);

module.exports = router;
