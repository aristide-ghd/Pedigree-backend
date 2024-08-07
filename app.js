const express = require('express');
const connectDB = require('./config/db');
const app = express();
const cors = require('cors');
const utilisateur = require('./routes/utilisateur.js');
const authorization = require('./routes/authorization.js');
const utils = require('./routes/utils.js');
const administrator = require('./routes/administrator.js');
const treefamilyRoutes = require('./routes/treefamilyRoutes.js');
require('dotenv').config();

// Connect to database
connectDB();


// Middleware
app.use(express.json());
app.use(cors())

// Routes
app.use('/api/admin/member', administrator);
app.use('/api/user/member', utilisateur);
app.use('/api/auth', authorization);
app.use('/api/utils', utils);
app.use('/api/tree', treefamilyRoutes);

// Port d'ecoute
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
