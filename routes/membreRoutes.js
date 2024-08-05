const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { ajouterMembre, add_admin_as_member, add_user_as_member, getTousMembres, modifierMembreParId, getMembreParSexe, AfficherMembreParId } = require('../controllers/membreController');
const { yupValidator } = require('../middleware/yup');
const {addMembreDto} = require('../dto/addmembreDto');
const {addAdminAsMemberDto} = require('../dto/addAdminAsMemberDto.js');


//Route pour ajouter un nouveau membre
// router.post('/ajouter', authMiddleware, yupValidator(addMembreDto), ajouterMembre);

//route pour ajouter un 'admin' à la liste des membres
router.post('/admin/member', authMiddleware, yupValidator(addAdminAsMemberDto), add_admin_as_member);

//route pour ajouter un 'user' à la liste des membres
router.post('/user/member', authMiddleware, yupValidator(addMembreDto), add_user_as_member);

//Route pour afficher tous les membres pour un utilisateur par sexe et par type de lien
router.get('/tous', authMiddleware, getTousMembres);

//Route pour modifier un membre d'un utilisateur par l'ID
//router.put('/modifier/:id', authMiddleware, modifierMembreParId);

//Route pour afficher un membre d'un utilisateur par l'ID
router.get('/afficher/:id', authMiddleware, AfficherMembreParId);

//Route pour recupérer les membres par sexe pour un utilisateur
router.get('/recuperer/:sexe', authMiddleware, getMembreParSexe);

module.exports = router;
