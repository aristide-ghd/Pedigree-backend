const Family = require('../models/family.js');

//A function to create a new family for a user

const create_family = async (req, res) => {
    let body = req.body;
    let fam_exist = false;
    let { family_name, ethnicity, village, country } =  body;
    family_name = family_name.toUpperCase();
    ethnicity = ethnicity.toUpperCase();
    village = village.toUpperCase();
    country = country.toUpperCase();
    try {
        const newFamily = await Family.findOne({family_name, ethnicity, country, village});
        if (newFamily) { // if the family exist
            fam_exist = true; // set the key 'exist' to true
            const idFamille = newFamily._id; // get the id of the family
            res.status(200).json({Message: "Cette famille existe Déja", family_name, fam_exist, idFamille}); // send back to the frontend these infos
        } else { // if the family do not exist
            // recreate the body with the info in uppercase
            const _body = {
                family_name: family_name,
                ethnicity: ethnicity,
                country: country, 
                village: village 
            };
            const newFamille = new Family(_body);
            res.status(201).json({Message: "Famille créer avec succès", newFamille, fam_exist}); // send back the infos on the newly created family and the status of the tag 'fam_exist'    
        };
    } catch(err) {
        res.status(400).json({Message: "Une erreur est survenu lors de la creation de la famille"});
    }
};

//A function to get the list of all the families added to date

const get_family_list =  async (req, res) => { 
    try {
        const list = await Family.find();
        res.status(201).json(list);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// A function to search for a specif

module.exports = {create_family, get_family_list};
