const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const orderRoutes = require('./src/routes/Order.route');

// Load environment variables
dotenv.config();

const app = express();

// Updated CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://order-management-system-blush.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add logging middleware to debug routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Mount routes directly 
app.use('/', orderRoutes);

// Make 404 handler more informative
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    message: 'Route not found',
    path: req.url,
    method: req.method
  });
});

// Improve global error handler
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    path: req.url,
    method: req.method,
    stack: err.stack
  });
  
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    path: req.url
  });
});
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Define port
const PORT = 3000;

// Connect to database and start server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
};

startServer();

