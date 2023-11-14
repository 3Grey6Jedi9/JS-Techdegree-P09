'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const Sequelize = require('sequelize');

// Import userRoutes
const userRoutes = require('./routes/userRoutes');
// Import coursesRoutes
const coursesRoutes = require('./routes/coursesRoutes');


// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// creating the Sequelize database connection
const sequelize = new Sequelize({
  storage: 'fsjstd-restapi.db',
  dialect: 'sqlite',
});

// Testing the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection successful!');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// Importing the User and Course models
const User = require('./models/user');
const Course = require('./models/course');

// create the Express app
const app = express();

app.use(express.json()); // Middleware for parsing JSON request bodies

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    // Handle Sequelize validation errors
    const validationErrors = err.errors.map((error) => error.message);
    res.status(400).json({ errors: validationErrors });
  } else {
    // Handle other errors with a 500 response
    res.status(err.status || 500).json({
      message: err.message,
      error: {},
    });
  }
});




// Use the userRoutes
app.use(userRoutes);
app.use(coursesRoutes);


// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Retrieve users along with their associated courses
app.get('/users', async (req, res) => {
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






// set our port
app.set('port', process.env.PORT || 5001);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
