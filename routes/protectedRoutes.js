const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/authMiddleware');
const {obtenirInfosProtegees} = require('../controllers/protectedRoutesControllers');

//Route protégée par le middleware
router.get('/infos-protegees', authMiddleware, obtenirInfosProtegees );

module.exports = router;