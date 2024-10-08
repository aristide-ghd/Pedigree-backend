const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { add_user_as_member, getTousMembres, list_family_members ,  get_user_info, modify_profile_user} = require('../controllers/membreController');
const { yupValidator } = require('../middleware/yup');
const {addMembreDto} = require('../dto/addmembreDto');

//Route pour ajouter un 'user' à la liste des membres
router.post('/new-member', authMiddleware, yupValidator(addMembreDto), add_user_as_member);

//Route pour obtenir toutes les infos de l'utilisateur connecté
router.get('/user-info', authMiddleware, get_user_info);

//Route permettant à l'utilisateur de modifier ses information personnel depuis le profil
router.put('/modify-profile', authMiddleware, modify_profile_user);

//Route pour afficher tous les membres pour un utilisateur par sexe et par type de lien
router.get('/tous', authMiddleware, list_family_members);


module.exports = router;
