const Membre = require('../models/membre');
const {Lien} = require('../models/lien');

// Fonction pour ajouter un membre
const ajouterMembre = async (req, res) => {
  try {
    //Recupere l'id de l'utilisateur qui est connecté
    const idUtilisateur = req.user.identity._id;
    let body = req.body;
    body.id_user = idUtilisateur;
    const nouveauMembre = new Membre(body);
    const ttt = await nouveauMembre.save();
    //Enregistement dans la table Lien
    const datalien = {
      id_membre: ttt._id,
      id_user: idUtilisateur,
      type_de_lien: req.body.type_de_lien
    };
    const nouveauLien = new Lien(datalien);
    let jdatalien = await nouveauLien.save();
    console.log(nouveauLien);

    const retour = {
      "Message": "Membre enregistré avec sucès"
    }
    res.status(201).json(retour);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Fonction pour afficher tous les membres pour un utilisateur par sexe et par type de lien
const getTousMembres = async (req, res) => {
  const idUtilisateur = req.user.identity._id
  //Recupere les params de requete si ils sont fournis
  const {sexe, type_de_lien} = req.query;
  try {

    //Assure la recuperation des membres de user connecté
    let filtre = {id_user: idUtilisateur};

    //Ajoute le paramètre 'sexe' à l'objet filtre s'il est fourni
    if(sexe)
    {
      filtre.sexe = sexe;
    }

    // Vérifie si un type de lien a été fourni dans les paramètres de la requête.
    if(type_de_lien)
    {
      // Lien.find cherche dans Lien tous les documents qui ont le type_de_lien spécifié et appartiennent à l'utilisateur.
      // La projection 'id_membre' indiquant la recuperation des champs id_membre des documents trouvés.
      const liens = await Lien.find({ type_de_lien, id_user: idUtilisateur}, 'id_membre');

      // Crée un tableau idmembres contenant uniquement les id_membre des liens trouvés
      const idmembres = liens.map(lien => lien.id_membre);

      // Ajoute un filtre pour ne récupérer que les membres dont l'ID est dans le tableau idsMembres
      filtre._id = { $in: idmembres };
    }

    //Requete pour obtenir les membres avec le filtre
    const membres = await Membre.find(filtre);
    res.status(201).json(membres);
  } catch (err) {
    res.status(400).json({ message: "Aucun membre disponible" });
  }
};

// Fonction pour afficher un membre d'un utilisateur
const AfficherMembreParId = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    const membre = await Membre.findOne({_id:req.params.id},{_id: false });
    console.log(membre);
    
    if(!membre) {
      return res.status(400).json({ message: "Membre non trouvé" });
    }
    res.status(201).json({ message: "Membre trouvé avec succès", data: membre });
  }
  catch (err) {
    res.status(400).json({ message: "Erreur de lecture"});
  }
};

// Fonction pour modifier un membre d'un utilisateur
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
    const idUtilisateur = req.user.identity._id
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

module.exports = { ajouterMembre, getTousMembres, modifierMembreParId, getMembreParSexe, AfficherMembreParId };
