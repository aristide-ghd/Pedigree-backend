// src/context/FamilyContext.js
import React, { createContext, useState, useContext } from 'react';

// Créer le contexte
const FamilyContext = createContext();

// Créer le provider
export const FamilyProvider = ({ children }) => {
  const [familyData, setFamilyData] = useState({
    family_name: '',
    idFamille: null,
    fam_exist: null
    // Ajoutez d'autres données de famille ici si nécessaire
  });

  // exist "family_name": "MOUSSA",
  // "fam_exist": true,
  // "idFamille": "66a7c855a762f580936399c3"

  // "Message": "Famille créer avec succès",
  //   "newFamille": {
  //       "family_name": "AMOUSSA",
  //       "ethnicity": "KOTOKOLI",
  //       "country": "ARGENTINA",
  //       "village": "ALEDJO",
  //       "_id": "66b104e5213b90aecec9ef7f"
  //   },
  //   "fam_exist": false}

  return (
    <FamilyContext.Provider value={{ familyData, setFamilyData }}>
      {children}
    </FamilyContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useFamily = () => {
  return useContext(FamilyContext);
};