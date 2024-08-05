const express = require('express');
const router = express.Router();
const checkPermission = require('../middleware/RoleMiddleware.js');
const { yupValidator } = require('../middleware/yup');
const {addMembreDto} = require('../dto/addmembreDto');
const { ajouterMembre, add_admin_as_member, add_user_as_member, getTousMembres, modifierMembreParId, getMembreParSexe, AfficherMembreParId } = require('../controllers/membreController');

router.put('/modifier/:id', checkPermission('ADMIN'), modifierMembreParId);

router.post('/ajouter', checkPermission('ADMIN'), yupValidator(addMembreDto), ajouterMembre);

module.exports = router;
