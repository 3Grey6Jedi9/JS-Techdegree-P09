const { Sequelize, DataTypes } = require('sequelize');
const User = require('./user');
const sequelize = require('../database')




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
    allowNull: true,
  },
  materialsNeeded: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});





module.exports = Course;
