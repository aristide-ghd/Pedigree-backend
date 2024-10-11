//const Family = require('../models/family.js')

// const checkFamilyExist = async (req, res, next) => {
//     const {family_name, ethnicity, village, country } =  req.body;

//     try {
//         //check if the family already exists
//         const newFamily = await Family.findOne({family_name, ethnicity, country, village});
//         if (newFamily) {
//             return res.status(400).json( {message: "L'arbre de cette famille a déja été créer" });
//         }
//         next();
//     }
//     catch(err) {
//         res.status(500).json({error: "Une erreur est survenus lors de l'enregistrement de la famille"});
//     }
// };

// module.exports = {checkFamilyExist};