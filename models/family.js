const mongoose = require('mongoose');

//Schema mongoose pour la table 'famille'

const familySchema = new mongoose.Schema ({
    family_name: { type: String, required: true },
    ethnicity: { type: String, required: true},
    country: { type: String, required: true},
    village: {type: String, required: true},
    id_creator:{ type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: false},
    id_famille: { type: mongoose.Schema.Types.ObjectId, ref: 'Famille', required: false}
});

module.exports = mongoose.model('Family', familySchema);