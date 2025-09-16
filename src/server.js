const app = require('./app');
const { sequelize } = require('./config/database');
const PORT = process.env.PORT || 3000;

// Test database connection and start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: false });
    console.log('Database synchronized.');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();