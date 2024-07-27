const { object, string, number, date, InferType } = require('yup');

exports.add_familyDto = object({
    body: object({
        family_name: string().required ('Veuillez renseigner votre nom de famille'),
        ethnicity: string().required('Votre origine ethnique est requise pour plus de précision'),
        country: string().required('Veuillez renseigner votre pays de provenance'),
        village: string().required('Votre village est requis pour plus de précision'),
        id_creator: string().nullable(),
        id_famille: string()
    }),
});