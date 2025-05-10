require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/authRoutes.js');
const invoiceRoutes = require('./routes/invoiceRoutes.js');
const connectDB = require('./config/db.js');
const { addItem } = require('./controllers/itemController.js');
const { addClient } = require('./controllers/clientController.js');
//const userRoutes = require('./routes/userRoutes');

// Initialize app
const app = express();

// Middleware
app.use(cors());
//middleware to parse JSON bodies
app.use(express.json());
//Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB()

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/items', addItem);
app.use('/api/clients', addClient);
//app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));