const { object, string, number, date, InferType } = require('yup');

exports.addUserDto = object({
  body: object({
    nom: string().required('Le nom est requis'),
    prenom: string().required('Le prénom est requis'),
    email: string().email('L\'email est invalide').required('L\'email est requis'),
    sexe: string().oneOf(['Masculin', 'Féminin']),
    mot_de_passe: string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').required('Le mot de passe est requis'),
  }),  
});
