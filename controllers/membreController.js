const Membre = require('../models/membre');
const {Lien} = require('../models/lien');
const Family = require('../models/family.js');
const User = require('../models/user/user');
const mongoose = require('mongoose');
const { date } = require('yup');


const ajouterMembre = async (req, res) => {
  try {
    const idUtilisateur = req.user.identity._id;
    let body = req.body;
    body.id_user = idUtilisateur;
    let { nom, prenom, date_de_naissance, sexe, groupe_sanguin, electrophorese } = body;
    nom = nom.toUpperCase();
    prenom = prenom.toUpperCase();
    groupe_sanguin = groupe_sanguin.toUpperCase();
    electrophorese = electrophorese.toUpperCase();
    const check =  await Membre.findOne({ nom, prenom, date_de_naissance, sexe, groupe_sanguin, electrophorese });
    if (check) {
      return res.status(403).json({Message: "Cette personne est déja membre de la famille"});
    } else {
      const _body = {
        nom: nom,
        prenom: prenom,
        sexe: sexe,
        date_de_naissance: date_de_naissance,
        groupe_sanguin: groupe_sanguin,
        electrophorese: electrophorese,
        id_user: body.id_user
      };
      if ('statut_matrimonial' in body)
          Object.assign(_body, { statut_matrimonial: body.statut_matrimonial });
      if ('id_conjoint' in body)
          Object.assign(_body, { id_conjoint: body.id_conjoint});
      if ('id_pere' in body)
          Object.assign(_body, { id_pere: body.id_pere });
      if ('id_mere' in body)
          Object.assign(_body, { id_mere: body.id_mere });
      if ('profession' in body)
          Object.assign(_body, { profession: body.profession });
      if ('religion' in body)
          Object.assign(_body, { religion: body.religion });
      if ('signe_du_fa' in body)
          Object.assign(_body, { signe_du_fa: body.signe_du_fa });
      const nouveauMembre = new Membre(_body);
      const ttt = await nouveauMembre.save();
      const datalien = {
        id_membre: ttt._id,
        id_user: idUtilisateur,
        type_de_lien: req.body.type_de_lien
      };
      const nouveauLien = new Lien(datalien);
      await nouveauLien.save();
      res.status(201).json({Message: "Membre enregistré avec succès"});
      console.log(nouveauLien);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const add_admin_as_member = async (req, res) => {
  try {
    const idUtilisateur = req.user.identity._id;
    let body = req.body;
    body.id_user = idUtilisateur;
    let { nom, prenom, date_de_naissance, groupe_sanguin, electrophorese } = body;
    nom = nom.toUpperCase();
    prenom = prenom.toUpperCase();
    groupe_sanguin = groupe_sanguin.toUpperCase();
    electrophorese = electrophorese.toUpperCase();
    const check =  await Membre.findOne({ nom, prenom, date_de_naissance, groupe_sanguin, electrophorese });
    if (check) {
      return res.status(403).json({Message: "Cette personne est déja membre de la famille"});
    } else {
      const _body = {
        nom: nom,
        prenom: prenom,
        date_de_naissance: date_de_naissance,
        groupe_sanguin: groupe_sanguin,
        electrophorese: electrophorese,
        id_user: body.id_user
      };
      if ('sexe' in body)
          Object.assign(_body, {sexe: body.sexe});
      if ('statut_matrimonial' in body)
          Object.assign(_body, { statut_matrimonial: body.statut_matrimonial });
      if ('id_conjoint' in body)
          Object.assign(_body, { id_conjoint: body.id_conjoint});
      if ('id_pere' in body)
          Object.assign(_body, { id_pere: body.id_pere });
      if ('id_mere' in body)
          Object.assign(_body, { id_mere: body.id_mere });
      if ('profession' in body)
          Object.assign(_body, { profession: body.profession });
      if ('religion' in body)
          Object.assign(_body, { religion: body.religion });
      if ('signe_du_fa' in body)
          Object.assign(_body, { signe_du_fa: body.signe_du_fa });
      const nouveauMembre = new Membre(_body);
      await nouveauMembre.save();// add the family owner himself as a member of the family
      res.status(201).json({Message: "Vous avez été ajouter comme membre avec succès"});
    }

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const add_user_as_member = async (req, res) => {
  try {
    const idUtilisateur = req.user.identity._id;
    let body = req.body;
    body.id_user = idUtilisateur;
    let { nom, prenom, date_de_naissance, groupe_sanguin, electrophorese } = body;
    nom = nom.toUpperCase();
    prenom = prenom.toUpperCase();
    groupe_sanguin = groupe_sanguin.toUpperCase();
    electrophorese = electrophorese.toUpperCase();
    const check =  await Membre.findOne({ nom, prenom, date_de_naissance, groupe_sanguin, electrophorese });
    if (check) {
      return res.status(403).json({Message: "Cette personne est déja membre de la famille"});
    } else {
      const _body = {
        nom: nom,
        prenom: prenom,
        date_de_naissance: date_de_naissance,
        groupe_sanguin: groupe_sanguin,
        electrophorese: electrophorese,
        id_user: body.id_user
      };
      if ('sexe' in body)
        Object.assign(_body, {sexe: body.sexe});
      if ('statut_matrimonial' in body)
          Object.assign(_body, { statut_matrimonial: body.statut_matrimonial });
      if ('id_conjoint' in body)
          Object.assign(_body, { id_conjoint: body.id_conjoint});
      if ('id_pere' in body)
          Object.assign(_body, { id_pere: body.id_pere });
      if ('id_mere' in body)
          Object.assign(_body, { id_mere: body.id_mere });
      if ('profession' in body)
          Object.assign(_body, { profession: body.profession });
      if ('religion' in body)
          Object.assign(_body, { religion: body.religion });
      if ('signe_du_fa' in body)
          Object.assign(_body, { signe_du_fa: body.signe_du_fa });
      const nouveauMembre = new Membre(_body);
      const ttt = await nouveauMembre.save();
      //Enregistement dans la table Lien
      const datalien = {
        id_membre: ttt._id,
        id_user: idUtilisateur,
        type_de_lien: req.body.type_de_lien
      };
      const nouveauLien = new Lien(datalien);
      await nouveauLien.save();
      res.status(201).json({Message: "Vous avez été ajouter comme membre avec succès"});
      console.log(nouveauLien);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Fonction pour obtenir la list des membres de famille de l'utilisateur connecté
const list_family_members = async (req, res) => {
    const nom_de_famille = req.user.identity.nom;
    try {
      const members = await Membre.find({nom: nom_de_famille});
      res.status(201).json(members);
    } catch(error) {
      res.status(400).json({Message: 'Erreur au niveau de l\'obtention de la list des membres'});
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

// Fonction pour afficher les détails d'un membre 
const details_member = async (req, res) => {
 try {
  //the id stored in 'req.params.id' is converted to a format readable by mongoDB and then use to find the member who's details we want to view, in the database
    const membre = await Membre.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, { _id: false });
    if(!membre) {
      return res.status(400).json({ message: "Membre non trouvé" });
    }
    //fill the object with the information regarding the member in question
    const details = {
      nom: membre.nom,
      prenom: membre.prenom,
      sexe: membre.sexe,
      date_de_naissance: membre.date_de_naissance,
      statut_matrimonial: membre.statut_matrimonial,
      profession: membre.profession,
      religion: membre.religion,
      groupe_sanguin: membre.groupe_sanguin,
      electrophorese: membre.electrophorese
    };
    //store the id of the 'conjoint' in a variable, same for the father and mother
    const id_du_conjoint = membre.id_conjoint;
    const id_père = membre.id_pere;
    const id_mere = membre.id_mere;
    // if the member does have a conjoint, add his information to the details of the member we are currentmy viewing
    if (id_du_conjoint != null) {
      const conjoint = await Membre.findOne({_id: id_du_conjoint});
      const conjoint_info = { nom: conjoint.nom, prenom: conjoint.prenom };
      Object.assign(details, {conjoint: conjoint_info});
    }
    // same process for the father and the mother
    if (id_père != null) {
      const père = await Membre.findOne({_id: id_père});
      const père_info = { nom: père.nom, prenom: père.prenom };
      Object.assign(details, {père: père_info});
    }
    if (id_mere != null) {
      const mère = await Membre.findOne({_id: id_mere});
      const mère_info = { nom: mère.nom, prenom: mère.prenom };
      Object.assign(details, {mère: mère_info});
    }
    res.status(201).json({ message: "Membre trouvé avec succès", data: details});
  } catch (err) {
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

module.exports = { ajouterMembre, add_admin_as_member, add_user_as_member, list_family_members, getTousMembres, modifierMembreParId, getMembreParSexe, details_member };
