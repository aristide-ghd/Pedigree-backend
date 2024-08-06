const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { ajouterMembre, add_admin_as_member, add_user_as_member, getTousMembres, modifierMembreParId, getMembreParSexe, AfficherMembreParId } = require('../controllers/membreController');
const { yupValidator } = require('../middleware/yup');
const {addMembreDto} = require('../dto/addmembreDto');

//route pour ajouter un 'user' à la liste des membres
router.post('/user/member', authMiddleware, yupValidator(addMembreDto), add_user_as_member);

//Route pour afficher tous les membres pour un utilisateur par sexe et par type de lien
router.get('/tous', authMiddleware, getTousMembres);


//Route pour recupérer les membres par sexe pour un utilisateur
router.get('/recuperer/:sexe', authMiddleware, getMembreParSexe);

module.exports = router;
