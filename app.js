const express = require('express');
const connectDB = require('./config/db');
const membreRoutes = require('./routes/membreRoutes');
const userRoutes = require('./routes/userRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const lienRoutes = require('./routes/lienRoutes');
const RoleRoute = require('./routes/RoleRoute');
require('dotenv').config();
const cors = require('cors');

const app = express();

// Connect to database
connectDB();


// Middleware
app.use(express.json());
app.use(cors())

// Routes
app.use('/api/membres', membreRoutes);
app.use('/api/utilisateurs', userRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/liens', lienRoutes);
app.use('/api/UserRoles', RoleRoute);

// Port d'ecoute
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
