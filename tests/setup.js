const { sequelize } = require('../src/config/database');
// Setup test database before all tests
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    await sequelize.sync({ force: true }); // Reset database for clean tests
    console.log('Test database setup complete');
  } catch (error) {
    console.error('Test setup failed:', error);
    throw error; // Re-throw to fail the test suite
  }
});
// Cleanup after all tests
afterAll(async () => {
  try {
    await sequelize.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Test cleanup failed:', error);
  }
});
// Set test environment
process.env.NODE_ENV = 'test';