const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { ajouterMembre, getTousMembres, modifierMembreParId, getMembreParSexe } = require('../controllers/membreController');

//Route pour ajouter un nouveau membre
router.post('/ajouter', authMiddleware, ajouterMembre);

//Route pour afficher tous les membres pour un utilisateur
router.get('/tous', authMiddleware, getTousMembres);

//Route pour modifier un membre d'un utilisateur par l'ID
router.put('/modifier/:id', modifierMembreParId);

//Route pour recupérer les membres par sexe pour un utilisateur
router.get('/recuperer/:sexe', getMembreParSexe);

module.exports = router;
