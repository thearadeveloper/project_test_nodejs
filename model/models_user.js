const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

// Define a model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    default:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1200px-User-avatar.svg.png'
  },
});
// Hash the user's password before saving it to the database
// User.beforeCreate(async (user) => {
//   const hashedPassword = await bcrypt.hash(user.password, 10);
//   user.password = hashedPassword;
// });

// User.beforeUpdate(async (user) => {
//   // Check if the password has changed before hashing
//   if (user.changed('password')) {
//     const hashedPassword = await bcrypt.hash(user.password, 10);
//     user.password = hashedPassword;
//   }
// });
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