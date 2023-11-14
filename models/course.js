const { Sequelize, DataTypes } = require('sequelize');

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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  },
});

Course.belongsTo(User, { foreignKey: 'userId' });

module.exports = Course;
