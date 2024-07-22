const  { object, string, number, date, InferType } = require('yup');

exports.addMembreDto =  object({
  body: object({
    nom: string().required('Le nom est requis'),
    prenom: string().required('Le prénom est requis'),
    sexe: string().oneOf(['Masculin', 'Féminin', 'Autre']).required('Le genre est requis'),
    date_de_naissance: date().default(() => new Date()),
    statut_matrimonial: string().oneOf(['Marie(e)', 'Celibataire', 'Divorce(e)', 'Veuf(ve)']),
    conjoint: string(),
    id_pere: string().default(null),
    id_mere: string().default(null),
    type_de_lien: string().oneOf(['Père', 'Mère', 'Beau-père', 'Belle-mère', 'Frère', 'Soeur', 'Beau-Frère', 'Belle-Soeur', 'Fils', 'Fille', 'Oncle', 'Tante', 'Cousin', 'Cousine', 'Grand-Père', 'Grand-Mère', 'Epouse', 'Epoux']).required('Le type de lien est requis'),
    profession: string(),
    religion: string().oneOf(['Christianisme(Evangelique, Catholique)', 'Islam', 'Hindouisme', 'Bouddhisme', 'Judaisme']),
    groupe_sanguin: string(),
    signe_du_fa: string(),
    electrophorese: string(),
    id_user: string(),
    id_arbre: string(),
  }),
});
