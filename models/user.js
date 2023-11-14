const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  storage: 'fsjstd-restapi.db',
  dialect: 'sqlite',
});

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
