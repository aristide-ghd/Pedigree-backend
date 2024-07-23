//import de Mongoose
const mongoose = require('mongoose');
//Definition des types de liens
const TYPES_LIENS = ['Père', 'Mère', 'Beau-père', 'Belle-mère', 'Frère', 'Soeur', 'Beau-Frère', 'Belle-Soeur', 'Fils', 'Fille', 'Oncle', 'Tante', 'Cousin', 'Cousine', 'Grand-Père', 'Grand-Mère', 'Epouse', 'Epoux'];

// Definition du schema mongoose pour les liens des membres de la famille
const lienSchema = new mongoose.Schema({
  type_de_lien: { type: String, enum: TYPES_LIENS, required: true },
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  id_membre: { type: mongoose.Schema.Types.ObjectId, ref: 'Membre', required: true }
});

// Exports du modèle pour l'utiliser ailleurs dans l'application
const Lien  = mongoose.model('Lien', lienSchema)
//Exports des types de liens pour utiliser ailleurs dans l'application
module.exports = {TYPES_LIENS,Lien};