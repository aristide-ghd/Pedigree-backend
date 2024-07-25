const { object, string, number, date, InferType } = require('yup');

exports.connexionDto = object({
    body: object({
        email: string().email('L\'email est invalide').required('L\'email est requis'),
        mot_de_passe: string().required('Le mot de passe est requis'),
    }),
});