const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { add_user_as_member, getTousMembres } = require('../controllers/membreController');
const { yupValidator } = require('../middleware/yup');
const {addMembreDto} = require('../dto/addmembreDto');

//route pour ajouter un 'user' à la liste des membres
router.post('/new-member', authMiddleware, yupValidator(addMembreDto), add_user_as_member);

//Route pour afficher tous les membres pour un utilisateur par sexe et par type de lien
router.get('/tous', authMiddleware, getTousMembres);


module.exports = router;
