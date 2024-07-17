//Exemple de contrôleur pour une route protégée
const obtenirInfosProtegees = (req, res) =>{
    res.status(200).json({ message: "Accès aux informations protégées accepté", user: req.user });
}

module.exports = { obtenirInfosProtegees };