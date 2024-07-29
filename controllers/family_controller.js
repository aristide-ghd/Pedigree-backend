const Family = require('../models/family.js');
const {checkFamilyExist} = require('../middleware/family_middleware.js');

//A function to create a new family for a user

const create_famliy = async (req, res) => {
    let body = req.body;
    console.log(body);
    try {
        await checkFamilyExist(req, res, async() => {
            //save the Family info receive by the frontend if it's not already existing
            const newFamille = new Family(body);
            await newFamille.save();
            // //if the it's a new family the id of the user is used as the creator_id
            // const idCreator = req.user.identity._id;
            // body.id_creator = idCreator;
        });
        res.status(201).json({Message: "Famille créer avec sucès"});
    } catch(err) {
        res.status(400).json({Message: "Une erreur est survenu lors de la creation de la famille"});
    }
};

//A function to update a member info by adding him to a family


module.exports = create_famliy;
