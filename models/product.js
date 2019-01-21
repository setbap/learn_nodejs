const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    allowNull: false,
    type: Sequelize.STRING
  },
  price: {
    allowNull: false,
    type: Sequelize.DOUBLE
  },
  imageUrl: {
    allowNull: false,
    type: Sequelize.STRING
  },
  description: {
    allowNull: false,
    type: Sequelize.TEXT
  },
});

module.exports = Product;