const express = require('express');
const router = express.Router();
const checkPermission = require('../middleware/RoleMiddleware.js');
const { yupValidator } = require('../middleware/yup');
const {addMembreDto} = require('../dto/addmembreDto');
const {addAdminAsMemberDto} = require('../dto/addAdminAsMemberDto.js');
const { ajouterMembre, add_admin_as_member, modifierMembreParId, details_member } = require('../controllers/membreController');

router.put('/modifier/:id', checkPermission('ADMIN'), modifierMembreParId);// modifier membre

router.post('/ajouter', checkPermission('ADMIN'), yupValidator(addMembreDto), ajouterMembre);// ajouet membre

router.post('/admin/member', checkPermission('ADMIN'), yupValidator(addAdminAsMemberDto), add_admin_as_member);// formulaire d'ajout d'admin

router.get('/afficher/:id', checkPermission('ADMIN'), details_member);

module.exports = router;
