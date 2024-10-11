import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosSetup'; // Assurez-vous que le chemin est correct

const useLinkTypes = () => {
    const [linkTypes, setLinkTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLinkTypes = async () => {
            try {
                const response = await axiosInstance.get('/utils/typesDeLien'); // Endpoint pour récupérer les types de lien
                setLinkTypes(response.data.data); // Adapter selon la structure de réponse
            } catch (error) {
                setError('Erreur lors de la récupération des types de lien.');
            } finally {
                setLoading(false);
            }
        };

        fetchLinkTypes();
    }, []);

    return { linkTypes, loading, error };
};

export default useLinkTypes;