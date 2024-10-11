// src/components/MemberList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosSetup';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { Box, MenuItem, FormControl, Select, InputLabel, Typography, CircularProgress, Button } from '@mui/material';
// import Roles from '../roles/Roles'; // Importer le fichier des rôles
import { useAuth } from '../context/AuthContext'; // Utiliser le contexte d'authentification

const MemberList = () => {
  const { role } = useAuth(); // Récupérer le rôle de l'utilisateur depuis le contexte
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSex, setSelectedSex] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/user/member/tous`);
        if (response.data.length === 0) {
          setError('Aucun membre trouvé.');
        } else {
          setFilteredMembers(response.data);
        }
      } catch (error) {
        setError('Erreur lors de la récupération des membres.');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userResponse = await axiosInstance.get('/utils/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserData(userResponse?.data?.user);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.response?.data || error.message);
        setError('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      name: 'Nom',
      selector: row => row.nom,
    },
    {
      name: 'Prénom',
      selector: row => row.prenom,
    },
    {
      name: 'Date de Naissance',
      selector: row => moment(row.date_de_naissance).format("DD/MM/YYYY"),
    },
    {
      name: 'Sexe',
      selector: row => row.sexe ,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          {(userData?.id_membre === row._id || role === 'ADMIN') && (
            <Button
            onClick={() => handleDetail(row._id)}
            variant="contained"
            color="info"
            size="small"
            sx={{ mr: 1 }}
          >
            Détail
          </Button>)}
          {role === 'ADMIN' && (
            <Button
              onClick={() => handleEdit(row)}
              variant="contained"
              color="primary"
              size="small"
            >
              Modifier
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleEdit = (membre) => {
    navigate(`/modifier/${membre._id}`);
  };

  const handleDetail = (id) => {
    navigate(`/detail/${id}`);
  };

  const handleSexChange = (event) => {
    setSelectedSex(event.target.value);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Liste des Membres de la famille
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {error && <Typography color="error">{error}</Typography>}
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Sexe</InputLabel>
              <Select
                value={selectedSex}
                onChange={handleSexChange}
                label="Sexe"
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="Masculin">Masculin</MenuItem>
                <MenuItem value="Féminin">Féminin</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <DataTable
            columns={columns}
            data={filteredMembers}
            noDataComponent={<Typography>Aucun membre trouvé</Typography>}
          />
        </>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleGoHome}
        sx={{ mt: 2 }}
      >
        Retour à l'accueil
      </Button>
    </Box>
  );
};

export default MemberList;