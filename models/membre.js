//import de Mongoose
const mongoose = require('mongoose');
const { TYPES_LIENS } = require('./lien');

// Definition du schema mongoose pour les membres de la famille
const membreSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  sexe: { type: String, enum: ['Masculin', 'Feminin', 'Autre'], required: true },
  date_de_naissance: { type: Date, required: false },
  statut_matrimonial: { type: String, enum: ['Marie(e)', 'Celibataire', 'Divorce(e)', 'Veuf(ve)'], required: false },
  conjoint: { type: String, required: false },
  id_pere: { type: mongoose.Schema.Types.ObjectId, ref: 'Membre', default: null },
  id_mere: { type: mongoose.Schema.Types.ObjectId, ref: 'Membre', default: null },
  profession: { type: String, required: false },
  religion: { type: String, enum: ['Christianisme(Evangelique, Catholique)', 'Islam', 'Hindouisme', 'Bouddhisme', 'Judaisme'], required: false },
  groupe_sanguin: { type: String, required: false },
  signe_du_fa: { type: String, required: false },
  electrophorese: { type: String, required: false },
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  id_arbre: { type: mongoose.Schema.Types.ObjectId, ref: 'Arbre' },
  famille_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Famille', default: null },
});

// Exports du modèle pour l'utiliser ailleurs dans l'application
module.exports = mongoose.model('Membre', membreSchema);
