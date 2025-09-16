const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Notes API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      notes: '/api/notes',
      health: '/health',
      documentation: '/api-docs'
    },
    features:[
      'Create and manage notes',
      'search functionality',
      'category organization',
      'Pin important notes',
      'Archive notes'
    ]
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Swagger documentation
const { swaggerUi, specs } = require('./config/swagger');
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Notes API Documentation',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
    },
  })
);

//API ROUTES
const notesRoutes = require('./routes/notes');
app.use('/api/notes', notesRoutes);

//404 error handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    suggested: 'check /api-docs for available endpoints'
  });
});

//GLOBAL ERROR HANDLER
const errorHandler = require('./middleware/errorHandler'); 
app.use(errorHandler);

module.exports = app;