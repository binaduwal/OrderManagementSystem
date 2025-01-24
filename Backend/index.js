const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const orderRoutes = require('./src/routes/Order.route');
const connectDB = require('./src/DB/db');

// Load environment variables
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


//using routes
app.use('/orders', orderRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

