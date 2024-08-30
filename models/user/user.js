//import de mongoose
const mongoose = require('mongoose');
const Roles =  require("./roles.js");

//Definition du shema mongoose pour les utilisateurs
const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: [Roles[0].role.id, Roles[1].role.id], required: false},
  sexe: { type: String, enum: ['Masculin', 'Feminin'], required: false},
  date_de_naissance: { type: Date, required: true },
  mot_de_passe: { type: String, required: true },
  id_famille : {type: String, required: false},
  id_membre: {type: String, required: false}
});

//Hacher le mot de passe avant sauvegarde de l'utilisateur
// userSchema.pre('save', async function(next) {
//   if(!this.isModified('mot_de_passe'))
//     return next();
//   const salt = await bcrypt.genSalt(10);
//   this.mot_de_passe = await bcrypt.bash (this.mot_de_passe, salt);
//   next();
// });

//Methode pour verifier le mot de passe
// userSchema.methods.comparePassword = function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.mot_de_passe);
// };


//Exports du modèle pour l'utiliser ailleurs dans l'application
module.exports = mongoose.model('User', userSchema);