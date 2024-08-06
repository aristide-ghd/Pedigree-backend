const User = require('../models/user/user');
const jwt = require('jsonwebtoken');

const checkPermission = (permissions) => {
    return async (req, res, next) => {
      let token = req.header('Authorization');
      token = token.split(' ')[1];
      if(!token){
          return res.status(400).json({ message: "Accès refusé. Aucun jeton n'a été fourni" });
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const user_id = req.user.identity._id;
        const user = await User.findById(user_id);
        if (!user) 
          return res.status(404).send({ message: 'Utlisateur non enrégistrer' }); 
        const userRole = req.user.identity.role;
        if (permissions.includes(userRole)) {
            next();
        } else {
              res.status(403).json({ error: 'Accès Refusé, vous n\'avez pas les authorisations nécéssaire' });
          }
      } catch (err) {
          res.status(400).json({ message: "Jeton invalide" });
      }
      
    };
};

module.exports = checkPermission;