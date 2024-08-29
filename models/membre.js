//import de Mongoose
const mongoose = require('mongoose');
const { TYPES_LIENS } = require('./lien');
const family = require('./family');

// Definition du schema mongoose pour les membres de la famille
const membreSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  sexe: { type: String, enum: ['Masculin', 'Feminin'], required: true },
  date_de_naissance: { type: Date, required: true },
  statut_matrimonial: { type: String, enum: ['Marie(e)', 'Celibataire', 'Divorce(e)', 'Veuf(ve)'], required: false },
  id_conjoint: { type: mongoose.Schema.Types.ObjectId, ref: 'Membre', default: null },
  id_pere: { type: mongoose.Schema.Types.ObjectId, ref: 'Membre', default: null },
  id_mere: { type: mongoose.Schema.Types.ObjectId, ref: 'Membre', default: null },
  profession: { type: String, required: false },
  religion: { type: String, enum: ['Christianisme', 'Islam', 'Hindouisme', 'Bouddhisme', 'Judaisme', 'Vodouisme', 'Autres'], required: false },
  groupe_sanguin: { type: String, required: true },
  signe_du_fa: { type: String, required: false },
  electrophorese: { type: String, required: true },
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  id_arbre: { type: mongoose.Schema.Types.ObjectId, ref: 'Arbre' },
});

// Exports du modèle pour l'utiliser ailleurs dans l'application
module.exports = mongoose.model('Membre', membreSchema);
