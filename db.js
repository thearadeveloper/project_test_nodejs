const Sequelize = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('learn_node', 'postgres', '123456', {
    host: '127.0.0.1',
    dialect: 'postgres',
  });

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;