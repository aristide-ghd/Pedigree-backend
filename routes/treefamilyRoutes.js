const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { generationTree } = require('../controllers/treefamilyControllers');

//Route pour recuperer les données pour l'arbre genealogique
router.get('/generation', authMiddleware, generationTree);

module.exports = router;