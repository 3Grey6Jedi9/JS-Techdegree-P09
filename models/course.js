const { Sequelize, DataTypes } = require('sequelize');


// Creating a Sequelize instance
const sequelize = new Sequelize({
  storage: 'fsjstd-restapi.db',
  dialect: 'sqlite',
});


const User = require('./user');


// Defining the Course Sequelize model
const Course = sequelize.define('Course', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  estimatedTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  materialsNeeded: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});



// Defining associations after both models are defined
Course.belongsTo(User, { foreignKey: 'userId' });

module.exports = Course;
