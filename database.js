const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  storage: 'fsjstd-restapi.db',
  dialect: 'sqlite',
});

module.exports = sequelize;
