const express = require('express');
const router = express.Router();
const create_famliy = require('../controllers/family_controller.js');
const { yupValidator } = require('../middleware/yup');
const add_familyDto = require('../dto/add_familyDto.js');

//Route pour créer une nouvelle famille
router.post('/create', create_famliy);
// router.post('/create', yupValidator(add_familyDto), create_famliy);

module.exports = router;
