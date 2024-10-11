
const Roles = [ {
  role: { id: "ADMIN", name: 'Role Administrateur'},
  permissions : [
      { id: 'me_as_member', name: 's\'enregister en tant que membre'},
      { id: 'add_member', name: 'ajouter un membre'},
      { id: 'death_declaration', name: 'declaration de décès'},
      { id: 'update_info', name: 'Modifier les infos des membres'},
      { id: 'overview', name: 'details des infos des membres'},
      { id: 'list', name: 'afficher la liste des membre de la famille'},
      { id: 'tree', name: 'consulter l\'abre généalogique'},
  ]
  },
  {
  role: {id : "USER", name: 'Role Utilisateur'},
  permissions: [
      { id: 'me_as_member', name: 's\'enregistrer en tant que membre'},
      { id: 'tree', name: 'consulter l\'abre généalogique'},
      { id: 'list', name: 'afficher la listed des membres de la famille'}
  ]
  }
];

export default Roles;