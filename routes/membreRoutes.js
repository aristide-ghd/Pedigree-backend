const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { ajouterMembre, getTousMembres, modifierMembreParId, getMembreParSexe, AfficherMembreParId } = require('../controllers/membreController');
const { yupValidator } = require('../middleware/yup');
const {addMembreDto} = require('../dto/addmembreDto');

//Route pour ajouter un nouveau membre
router.post('/ajouter', authMiddleware, yupValidator(addMembreDto) ,ajouterMembre);

//Route pour afficher tous les membres pour un utilisateur par sexe et par type de lien
router.get('/tous', authMiddleware, getTousMembres);

//Route pour modifier un membre d'un utilisateur par l'ID
router.put('/modifier/:id', authMiddleware, modifierMembreParId);

//Route pour afficher un membre d'un utilisateur par l'ID
router.get('/afficher/:id', authMiddleware, AfficherMembreParId);

//Route pour recupérer les membres par sexe pour un utilisateur
router.get('/recuperer/:sexe', authMiddleware, getMembreParSexe);

module.exports = router;
