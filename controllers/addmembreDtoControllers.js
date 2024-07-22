const Membre = require('../models/membre');
const { addMembreDto } = require('../dto/addmembreDto');

const addMembre = async (req, res) => {
    try {
        await addMembreSchema.validate(req.body);
        
        const { nom, prenom, sexe, date_de_naissance, statut_matrimonial, conjoint, id_pere, id_mere, type_de_lien, profession, religion, groupe_sanguin, signe_du_fa, electrophorese, id_arbre } = req.body;
        const id_user = req.user._id; // Assume que le middleware d'authentification ajoute l'utilisateur à req.user

        const nouveauMembre = new Membre({
            nom,
            prenom,
            sexe,
            date_de_naissance,
            statut_matrimonial, 
            conjoint,
            id_pere: id_pere || null,
            id_mere: id_mere || null,
            type_de_lien,
            profession,
            religion,
            groupe_sanguin,
            signe_du_fa,
            electrophorese,
            id_user,
            id_arbre,
        });

        const membreEnregistre = await nouveauMembre.save();
        res.status(201).json(membreEnregistre);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { addMembre };
