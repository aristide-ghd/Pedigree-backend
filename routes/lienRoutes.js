const express = require('express');
const router = express.Router();
const {getTypesDeLien} = require('../controllers/lienController');

//Route pour récuperer les types de lien
router.get('/types', getTypesDeLien);

module.exports = router;