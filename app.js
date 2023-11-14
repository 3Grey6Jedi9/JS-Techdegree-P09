'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const {Sequelize} = require("sequelize");

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// creating the Sequelize database connection

const sequelize = new Sequelize({
  storage: 'fsjstd-restapi.db',
  dialect: 'sqlite',

});

// Testing the database connection

sequelize.authenticate()
    .then(()=> {

      console.log('Database connection successful!');

    })
    .catch((error)=>{
      console.error('Database connection error:', error);

    });

// Importing the User and Course models

const User = require('./models/user');
const Course = require('./models/course');

// Associate the User and Course models
Course.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Course, {foreignKey: 'userId'});



// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Retrieve users along with their associated courses
app.get('/users', async (req, res)=>{

  const users = await User.findAll({

    include: [Course],
  });

res.json(users);
});


// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5001);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
