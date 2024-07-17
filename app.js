const express = require('express');
const connectDB = require('./config/db');
const membreRoutes = require('./routes/membreRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
const cors = require('cors');

const app = express();

// Connect to database
connectDB();

app.use(cors())
// Middleware
app.use(express.json());

// Routes
app.use('/api/membres', membreRoutes);
app.use('/api/utilisateurs', userRoutes);

// Port d'ecoute
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
