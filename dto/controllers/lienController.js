const Lien = require('../models/lien');
const {TYPES_LIENS} = require('../models/lien');

//Fonction pour ajouter un lien 
const ajouterLien = async(req, res) => {
    try {
        const nouveauLien = new Lien(req.body);
        await nouveauLien.save();
        const retour = {
            "Message": "Lien ajouté avec succès"
        };
        res.status(201).json(retour);
    }
    catch (err){
        res.status(400).json({ message: "Erreur lors de l'ajout" });
    }
};

// Récupérer les types de lien
const getTypesDeLien = (req, res) => {
  const type_de_lien = TYPES_LIENS;
  res.status(201).json(type_de_lien);
};

module.exports = { ajouterLien, getTypesDeLien };

// const creerLien = async (req, res) => {
//     const { idMembre, typeDeLien } = req.body;
//     const idUtilisateur = req.user._id; // Assume que le middleware d'authentification ajoute l'utilisateur à req.user
  
//     try {
//       const nouveauLien = new Lien({
//         idMembre,
//         idUtilisateur,
//         typeDeLien,
//       });
  
//       const lienEnregistre = await nouveauLien.save();
//       res.status(201).json(lienEnregistre);
//     } catch (error) {
//       console.error('Erreur lors de la création du lien:', error);
//       res.status(500).json({ message: 'Erreur serveur lors de la création du lien' });
//     }
//   };

