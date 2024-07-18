//import de Mongoose
const mongoose = require('mongoose');

// Definition du schema mongoose pour les membres de la famille
const membreSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  sexe: { type: String, enum: ['Masculin', 'Feminin', 'Autre'], required: true },
  date_de_naissance: { type: Date },
  statut_matrimonial: { type: String, enum: ['Marie(e)', 'Celibataire', 'Divorce(e)', 'Veuf(ve)'] },
  conjoint: { type: String, required: false },
  id_pere: { type: mongoose.Schema.Types.ObjectId, ref: 'Membre', default: null },
  id_mere: { type: mongoose.Schema.Types.ObjectId, ref: 'Membre', default: null },
  id_lien: { type: mongoose.Schema.Types.ObjectId, ref: 'Lien' },
  profession: { type: String, required: false },
  religion: { type: String, enum: ['Christianisme(Evangelique, Catholique)', 'Islam', 'Hindouisme', 'Bouddhisme', 'Judaisme'] },
  groupe_sanguin: { type: String },
  signe_du_fa: { type: String },
  electrophorese: { type: String },
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id_arbre: { type: mongoose.Schema.Types.ObjectId, ref: 'Arbre' }
});

// Exports du modèle pour l'utiliser ailleurs dans l'application
module.exports = mongoose.model('Membre', membreSchema);
