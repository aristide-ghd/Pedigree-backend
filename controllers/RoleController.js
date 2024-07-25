const Roles = require("../models/user/roles.js");

const send_permission_log= (req, res) => {
    const permisions = Roles;
    res.status(201).json(permisions);
};

module.exports = {send_permission_log};