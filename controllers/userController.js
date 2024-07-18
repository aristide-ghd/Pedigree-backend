const User = require('../models/user');
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');

// Fonction pour enregistrer un utilisateur et crypter le mot de passe
const enregistrerUtilisateur = async (req, res) => {
  try {
    //Debut cryptage du mot de passe
    const password = await bcrypt.hash( req.body.mot_de_passe, 10);
    const data = req.body;
    data.mot_de_passe = password; //Fin de cryptage 
    const nouvelUtilisateur = new User(req.body);
    await nouvelUtilisateur.save();
    const retour = {
      "Message" : "Utilisateur enregistré avec succès"
    }
    res.status(201).json(retour);
  } catch (err) {
    res.status(400).json({ message: "Cet e-mail existe déjà" });
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
    const return_token = generateJwt(utilisateur)
    console.log(return_token)
    res.status(200).json({ message: "Connexion réussie", date:return_token});
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
}

module.exports = { enregistrerUtilisateur, getTousUtilisateurs, modifierUtilisateurParEmail,connecterUtilisateur };
