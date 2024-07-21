const Lien = require('../models/lien');

// //Fonction pour ajouter un lien 
// const ajouterLien = async(req, res) => {
//     try {
//         const nouveauLien = new Lien(req.body);
//         await nouveauLien.save();
//         const retour = {
//             "Message": "Lien ajouté avec succès"
//         };
//         res.status(201).json(retour);
//     }
//     catch (err){
//         res.status(400).json({ message: "Erreur lors de l'ajout" });
//     }
// };
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

// Récupérer les types de lien
const getTypesDeLien = (req, res) => {
  const type_de_lien = ['Père', 'Mère', 'Beau-père', 'Belle-mère', 'Frère', 'Soeur', 'Beau-Frère', 'Belle-Soeur', 'Fils', 'Fille', 'Oncle', 'Tante', 'Cousin', 'Cousine', 'Grand-Père', 'Grand-Mère', 'Epouse', 'Epoux'];
  res.status(201).json(type_de_lien);
};

module.exports = { getTypesDeLien };