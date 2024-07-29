const express = require('express');
const router = express.Router();
const {create_family, get_family_list, } = require('../controllers/family_controller.js');
const { yupValidator } = require('../middleware/yup');
const {add_familyDto} = require('../dto/add_familyDto.js');

//Route pour créer une nouvelle famille
//router.post('/create', create_family);
router.post('/create', yupValidator(add_familyDto), create_family);

//Route pour aficher la list des familles enrégistrer
router.get('/list', get_family_list);

module.exports = router;
