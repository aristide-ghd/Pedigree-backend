const express = require('express');
const router = express.Router();
const {send_permission_log} =  require("../controllers/RoleController.js");


router.get('/All-Permision', send_permission_log);

module.exports = router;
