const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

// Define a model
const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
});

// Sync the defined models with the database schema
sequelize.sync()
  .then(() => {
    console.log('Models synchronized with the database schema.');
  })
  .catch((error) => {
    console.error('Unable to synchronize models with the database schema:', error);
  });

module.exports = {
  User,
};