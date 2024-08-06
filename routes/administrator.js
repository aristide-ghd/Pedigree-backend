const express = require('express');
const router = express.Router();
const checkPermission = require('../middleware/RoleMiddleware.js');
const { authMiddleware } = require('../middleware/authMiddleware');
const { yupValidator } = require('../middleware/yup.js');
const {addMembreDto} = require('../dto/addmembreDto.js');
const {addAdminAsMemberDto} = require('../dto/addAdminAsMemberDto.js');
const { ajouterMembre, add_admin_as_member, modifierMembreParId, details_member } = require('../controllers/membreController.js');

router.put('/modifier/:id', authMiddleware, checkPermission('ADMIN'), modifierMembreParId);// modifier membre

router.post('/ajouter', authMiddleware, checkPermission('ADMIN'), yupValidator(addMembreDto), ajouterMembre);// ajouter membre

router.post('/new-member', authMiddleware, checkPermission('ADMIN'), yupValidator(addAdminAsMemberDto), add_admin_as_member);// formulaire d'ajout d'admin

router.get('/details/:id', authMiddleware, checkPermission('ADMIN'), details_member);// détails sur les membres

module.exports = router;
