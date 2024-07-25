
const Roles = [ {
    role: { id: "ADMIN", name: 'Role Administrateur'},
    permissions : [
        { id: 'add_members', name: 'ajouter un membre'},
        { id: 'death_declaration', name: 'declaration de décès'},
        { id: 'update_info', name: 'Modifier les infos des membres'},
        { id: 'overview', name: 'details des infos des membres'}
    ]
    },
    {
    role: {id : "USER", name: 'Role Utilisateur'},
    permissions: [
        { id: 'add_members', name: 'ajouter membre'},
        { id: 'view_profile', name: 'consulter son profil'},
        { id: 'view_common_info', name: 'voir certains details des membres'},
        { id: 'modify_myinfo', name: 'modifier mes informations'}
    ]
    }
];

module.exports = Roles;