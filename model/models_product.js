const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');


// Define a model
const Product = sequelize.define('Product', {
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  qr_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  product_image: {
    type: DataTypes.BLOB('long'), // or DataTypes.TEXT, depending on your needs
    allowNull: true,
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
  Product,
};