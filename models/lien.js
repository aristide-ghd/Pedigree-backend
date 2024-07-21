//import de Mongoose
const mongoose = require('mongoose');

// Definition du schema mongoose pour les liens des membres de la famille
const lienSchema = new mongoose.Schema({
  type_de_lien: { type: String, enum: ['Père', 'Mère', 'Beau-père', 'Belle-mère', 'Frère', 'Soeur', 'Beau-Frère', 'Belle-Soeur', 'Fils', 'Fille', 'Oncle', 'Tante', 'Cousin', 'Cousine', 'Grand-Père', 'Grand-Mère', 'Epouse', 'Epoux'], required: true },
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  id_membre: { type: mongoose.Schema.Types.ObjectId, ref: 'Membre', required: true }
});

// Exports du modèle pour l'utiliser ailleurs dans l'application
module.exports = mongoose.model('Lien', lienSchema);
