const { object, string, number, date, InferType } = require('yup');
const {TYPES_LIENS} = require ('../models/lien');
const User = require('../models/user/user.js');


exports.addAdminAsMemberDto =  object({
  body: object({
    nom: string().required('Le nom est requis'),
    prenom: string().required('Le prénom est requis'),
    sexe: string().oneOf(['Masculin', 'Feminin']).required('Le genre est requis'),
    date_de_naissance: date().default(() => new Date()),
    statut_matrimonial: string().oneOf(['Marie(e)', 'Celibataire', 'Divorce(e)', 'Veuf(ve)']),
    id_conjoint: string().nullable(),
    //La fonction test vérifie que la valeur est soit null, soit un objectid valide en utilisant Types.ObjectId.isValid(value)
    id_pere: string().nullable(),
    id_mere: string().nullable(),
    // .test('is-object-id', 'identifiant de la mère invalide', value => value === null || Types.ObjectId.isValid(value)),
    type_de_lien: string().oneOf(TYPES_LIENS).nullable(),
    profession: string(),
    religion: string().oneOf(['Christianisme', 'Islam', 'Hindouisme', 'Bouddhisme', 'Judaisme']),
    groupe_sanguin: string(),
    signe_du_fa: string(),
    electrophorese: string(),
    id_arbre: string(),
    famille_id: string().nullable(),
  }),
});
