const mongoose = require('mongoose');

const membreSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String },
  sexe: { type: String, enum: ['Masculin', 'Feminin', 'Autre'] },
  date_de_naissance: { type: Date },
  date_de_deces: { type: Date },
  statut_matrimonial: { type: String, enum: ['Marie(e)', 'Celibataire', 'Divorce(e)', 'Veuf(ve)'] },
  religion: { type: String, enum: ['Christianisme(Evangelique, Catholique)', 'Islam', 'Hindouisme', 'Bouddhisme', 'Judaisme'] },
  groupe_sanguin: { type: String },
  electrophorese: { type: String },
  signe_du_fa: { type: String },
  id_lien: { type: mongoose.Schema.Types.ObjectId, ref: 'Lien' },
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id_pere: { type: mongoose.Schema.Types.ObjectId, ref: 'Membre' },
  id_mere: { type: mongoose.Schema.Types.ObjectId, ref: 'Membre' },
  id_arbre: { type: mongoose.Schema.Types.ObjectId, ref: 'Arbre' }
});

module.exports = mongoose.model('Membre', membreSchema);
