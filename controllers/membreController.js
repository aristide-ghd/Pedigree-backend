const Membre = require('../models/membre');
const Lien = require('../models/lien');

// Fonction pour ajouter un membre
const ajouterMembre = async (req, res) => {
  try {
    const nouveauMembre = new Membre(req.body);

    const idUtilisateur = req.user._id; // Assume que le middleware d'authentification ajoute l'utilisateur à req.user
    const membreEnregistre = await nouveauMembre.save();
    const typeDeLien = (req.body)
    await nouveauLien.save();
    const retour = {
      "Message": "Membre enregistré avec sucès"
    }
    res.status(201).json(retour);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Fonction pour afficher tous les membres pour un utilisateur
const getTousMembres = async (req, res) => {
  const idUtilisateur = req.user._id 
  try {
    const membres = await Membre.find({idUtilisateur});
    res.status(201).json(membres);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Fonction pour modifier un membre
const modifierMembreParId = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    const membreModifie = await Membre.updateOne({_id:req.params.id}, {$set:req.body});
    console.log(membreModifie);
    if(!membreModifie) {
      return res.status(400).json({ message: "Membre non trouvé" });
    }
    res.status(201).json({ message: "Membre modifié avec succès" });
  }
  catch (err) {
    res.status(400).json({ message: "Erreur de modification"});
  }
};

// Fonction pour récupérer les membres par sexe
const getMembreParSexe = async (req, res) => {
  const { sexe } = req.params;

  try {
    const membres = await Membre.find({ sexe });
    res.json(membres);
  } catch (error) {
    console.error('Erreur lors de la récupération des membres par sexe:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des membres par sexe' });
  }
};

// Contrôleur pour supprimer un membre de la famille
// exports.deleteMember = async (req, res) => {
//   try {
//     const membre = await Membre.findByIdAndDelete(req.params.id);

//     if (!membre) {
//       return res.status(404).json({ message: 'Membre non trouvé' });
//     }

//     res.json({ message: 'Membre supprimé avec succès' });
//   } catch (error) {
//     console.error('Erreur lors de la suppression du membre:', error);
//     res.status(500).json({ message: 'Erreur serveur lors de la suppression du membre' });
//   }
// };

module.exports = { ajouterMembre, getTousMembres, modifierMembreParId, getMembreParSexe };
