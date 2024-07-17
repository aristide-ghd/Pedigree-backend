const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if(!token){
        return res.status(400).json({ message: "Accès refusé. Aucun jeton n'a été fourni" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(400).json({ message: "Jeton invalide" });
    }
};

module.exports = {authMiddleware};