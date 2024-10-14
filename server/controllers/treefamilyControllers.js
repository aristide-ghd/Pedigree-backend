// const { obtenirMembresAvecFiltre } = require('../services/membresServices');
// const { obtenirUtilisateurs } = require('../services/userServices');
// const { obtenirDataLien } = require('../services/lienServices');


const Membre = require('../models/membre');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('../models/user/user');

// Fonction pour renvoyer les données des membres sous format JSON
const generationTree = async (req, res) => {
    try {
        const idUtilisateur = req.user.identity._id;
        // console.log(idUtilisateur);
        const object_user = await User.findOne({_id: new ObjectId(idUtilisateur)}, {_id: false });
        const idfamille = object_user.id_famille;
        // console.log(idfamille);
        // console.log(object_user);

        // Réaliser l'agrégation pour récupérer les membres avec leurs pères, mères et utilisateurs
        const aggregate = await Membre.aggregate([
            {
                $match: {
                    id_famille: idfamille
                }
            },
            {
                $lookup: {
                    from: "membres",  // Nom de la collection où se trouvent les pères
                    let: {
                        idpere: "$id_pere"
                    },  // Variable locale pour l'identifiant du père
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$idpere"] // Filtrer par l'identifiant du père
                                }
                            }
                        }
                    ],
                    as: "pere" // Nom du champ qui contiendra les données du père
                }
            },
            {
                $unwind: {
                    path: "$pere",  // Décompresse le tableau pour obtenir un seul objet père
                    preserveNullAndEmptyArrays: true //Permet de conserver les membres sans père
                }
            },
            {
                $lookup: {
                    from: "membres",// Nom de la collection où se trouvent les mères
                    let: {
                        idmere: "$id_mere"
                    },// Variable locale pour l'identifiant de la mère
                    pipeline: [
                        {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$idmere"] // Filtrer par l'identifiant de la mère
                            }
                        }
                        }
                    ],
                    as: "mere" // Nom du champ qui contiendra les données de la mère
                }
            },
            {
                $unwind: {
                    path: "$mere",  // Décompresse le tableau pour obtenir un seul objet mère
                    preserveNullAndEmptyArrays: true //Permet de conserver les membres sans mere
                }
            },
            {
                $lookup: {
                from: "membres",  // Nom de la collection où se trouvent les conjoints
                let: {
                    idconjoint: "$id_conjoint"
                },  // Variable locale pour l'identifiant du conjoint
                pipeline: [
                    {
                    $match: {
                        $expr: {
                            $eq: ["$_id", "$$idconjoint"] // Filtrer par l'identifiant du conjoint
                        }
                    }
                    }
                ],
                as: "conjoint" // Nom du champ qui contiendra les données du conjoint
                }
            },
            {
                $unwind: {
                    path: "$conjoint",  // Décompresse le tableau pour obtenir un seul objet conjoint
                    preserveNullAndEmptyArrays: true //Permet de conserver les membres sans conjoint
                }
            },
            {
                $lookup: {
                    from: "users",  // Nom de la collection où se trouvent les utilisateurs
                    let: {
                        iduser: "$id_user"
                    },  // Variable locale pour l'identifiant de l'utilisateur
                    pipeline: [
                        {
                        $match: {
                            $expr: {
                            $eq: ["$_id", "$$iduser"] // Filtrer par l'identifiant de l'utilisateur
                            }
                        }
                        }
                    ],
                    as: "user" // Nom du champ qui contiendra les données de l'utilisateur
                }
            },
            {
                $unwind: "$user" // Décompresse le tableau pour obtenir un seul objet user
            },
            {
                $lookup: {
                    from: 'liens',   // Nom de la collection où nous cherchons les relations
                    let: { idmembre: '$_id' },  // On récupère l'ID du membre en cours de traitement
                    pipeline: [  // On définit un pipeline d'opérations pour effectuer la correspondance
                        {
                            $match: { // On spécifie les conditions de correspondance
                                $expr: {
                                    $and: [
                                        { $eq: ['$id_membre', '$$idmembre'] },  // Correspondance avec l'ID du membre
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'lien'  // Le résultat du lookup sera stocké sous ce champ
                }
            },
            {
                $unwind: {
                    path: "$lien",  // Décompresse le tableau pour obtenir un seul objet lien
                    preserveNullAndEmptyArrays: true // Permet de conserver les membres sans lien spécifique
                }
            },
            {
                $project: {
                    // Choisir les champs à exclure dans le résultat final
                    id_pere: 0,
                    id_mere: 0,
                    id_user: 0,
                    id_conjoint: 0
                }
            }
        ]);

        // Envoyer les résultats au format JSON
        res.status(200).json(aggregate);
    } catch (error) {
        console.error("Erreur lors de la récupération des membres:", error);
        res.status(400).json({ message: "Erreur lors de la recuperation des membres" });
    }
};

module.exports = { generationTree };
