const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs')

// Creating a Sequelize instance
const sequelize = new Sequelize({
  storage: 'fsjstd-restapi.db',
  dialect: 'sqlite',
});


// Defining the User Sequelize model
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
    unique: {
      args: true,
      msg: 'Email address already in use!'
    },
    validate:{
      isEmail:{
        args: true,
        msg: 'Please provide a valid email address'
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});



module.exports = User;
