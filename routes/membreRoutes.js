const express = require('express');
const router = express.Router();
const { ajouterMembre, getTousMembres, modifierMembreParId } = require('../controllers/membreController');

//Route pour ajouter un nouveau membre
router.post('/ajouter', ajouterMembre);

//Route pour afficher tous les membres
router.get('/tous', getTousMembres)

//Route pour modifier un membre par l'ID
router.put('/modifier/:id', modifierMembreParId)

module.exports = router;
