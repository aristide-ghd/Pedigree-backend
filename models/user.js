//import de mongoose
const mongoose = require('mongoose');

//Definition du shema mongoose pour les utilisateurs
const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sexe: { type: String, enum: ['Masculin', 'Feminin', 'Autre..'], required: false},
  mot_de_passe: { type: String, required: true }
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