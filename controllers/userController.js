const User = require('../models/user/user');
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');
const Roles =  require("../models/user/roles.js");
const Family = require('../models/family.js');

// Fonction pour enregistrer un utilisateur et crypter le mot de passe
const enregistrerUtilisateur = async (req, res) => {
  let fam_owner = false;
  const data = req.body;
  let nv_nom = data.nom.toUpperCase();
  try {
    //Debut cryptage du mot de passe
    const password = await bcrypt.hash( req.body.mot_de_passe, 10);
    data.mot_de_passe = password; //Fin de cryptage 
    let {fam_exist} = data; // obtain the family_tag info
    if (!fam_exist) { // if the family did not exist
      fam_owner = true;// set the owner tag to 'true'
        const user_data = { // fill the field of the table 'user' with the frotntend info
          nom: nv_nom,
          prenom: data.prenom,
          email: data.email,
          role: Roles[0].role.id,
          sexe: data.sexe,
          mot_de_passe: data.mot_de_passe,
          id_famille : data.newFamille._id,
        };
        const new_user = new User(user_data);
        let newUser = await new_user.save(); // save in the new user in the database
        const fam_info = { // fill the field of the table 'family' with the frotntend info
          family_name: data.newFamille.family_name,
          ethnicity: data.newFamille.ethnicity,
          country: data.newFamille.country, 
          village: data.newFamille.village,
          id_creator: newUser._id
        };
        const nvFamille = new Family(fam_info);
        await nvFamille.save();// save the family created in the database
        res.status(201).json({Message: "Utilisateur enregistré avec succès", fam_owner, new_user});
    } else {
        const user_data = {
        nom: nv_nom,
        prenom: data.prenom,
        email: data.email,
        role: Roles[1].role.id,
        sexe: data.sexe,
        mot_de_passe: data.mot_de_passe,
        id_famille : data.idFamille
      };
      const new_user = new User(user_data);
      await new_user.save();
      res.status(201).json({Message: "Utilisateur enregistré avec succès", fam_owner, new_user});
    };
  } catch (err) {
    // Vérifie si l'erreur est liée à un duplicata d'e-mail(11000 est le code d'erreur MongoDB)
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      res.status(400).json({ message: "Cet e-mail existe déjà" });
    } else {
      res.status(400).json({ message: "Erreur lors de l'enregistrement de l'utilisateur" });
    }
  }
};

// Fonction pour afficher tous les utilisateurs
const getTousUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await User.find();
    res.status(201).json(utilisateurs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Fonction pour modifier un utilisateur Par Email
const modifierUtilisateurParEmail = async (req, res) => {
  try {
    console.log(req.params.email);
    console.log(req.body);
    const utilisateurModifie = await User.updateOne({"email":req.params.email}, {$set:req.body});
    console.log(utilisateurModifie);
    if(!utilisateurModifie) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }
    res.status(201).json({ message: "Utilisateur modifié avec succès" });
  }
  catch (err) {
    res.status(400).json({ message: "Erreur de modification"});
  }
};

//Fonction pour connecter un utilisateur 
const connecterUtilisateur = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    let fam_owner = false;

    //Verifie si l'email existe dans la base de données
    const utilisateur = await User.findOne({ email }, { projection: { _id: 0} });
    if(!utilisateur) {
      return res.status(400).json({ message: "L'email est invalide" });
    }

    //Comparer le mot de passe entré avec le mot de passe crypté dans la base de données
    const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    if(!motDePasseValide){
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    //Si les informations sont valides
    console.log(utilisateur);
    const return_token = generateJwt(utilisateur);
    if (utilisateur.role === 'ADMIN')
        fam_owner = true;
    else
        fam_owner = false;
    //console.log(return_token)
    res.status(200).json({ message: "Connexion réussie", date:return_token, utilisateur, fam_owner});
  }
  catch (err) {
    res.status(400).json({ message: "Veuillez-vous inscrire" });
  }
};

//Generation d'un jeton après connexion de l'utilisateur
const generateJwt= (identity) =>{
  try {
    const token = jwt.sign({ identity }, process.env.JWT_SECRET, { expiresIn: "12h" });

    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 12);

    return {
      token,
      expiresIn: "12h",
      expirationTime
    };
  }
  catch (error) {
    console.log(error);
  }
};

//Fonction pour obtenir les infos du profil de l'utilisateur connecté
const getProfile = async (req, res) => {
  try {
    const idUtilisateur = req.user.identity._id;
    const user = await User.findById(idUtilisateur);
    if(!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé"});
    }
    res.status(200).json({user});
  }
  catch (err)
  {
    res.status(400).json({ message: "Erreur lors de la recupération du profil"});
  }
}
module.exports = { enregistrerUtilisateur, getTousUtilisateurs, modifierUtilisateurParEmail, connecterUtilisateur, getProfile };
