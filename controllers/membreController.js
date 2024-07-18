const Membre = require('../models/membre');

// Fonction pour ajouter un membre
const ajouterMembre = async (req, res) => {
  try {
    const nouveauMembre = new Membre(req.body);
    await nouveauMembre.save();
    const retour = {
      "Message": "Membre enregistré avec sucès"
    }
    res.status(201).json(retour);
  } catch (err) {
    res.status(400).json({ message: "Erreur d'enregistrement" });
  }
};

// Fonction pour afficher tous les membres
const getTousMembres = async (req, res) => {
  try {
    const membres = await Membre.find();
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

module.exports = { ajouterMembre, getTousMembres, modifierMembreParId };
