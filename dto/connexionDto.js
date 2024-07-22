import { object, string, number, date, InferType } from 'yup';

const connexionDto = object({
    body: object({
        email: string().email('L\'email est invalide').required('L\'email est requis'),
        mot_de_passe: string().required('Le mot de passe est requis'),
    }),
});

module.exports = {connexionDto};