'use strict';

// loading modules
const express = require('express');
const morgan = require('morgan');
const sequelize = require('./database'); // Import centralized Sequelize instance
const authenticateUser = require('./auth'); // Importing the authentication middleware


// Importing userRoutes
const userRoutes = require('./routes/userRoutes');


// Importing coursesRoutes
const coursesRoutes = require('./routes/coursesRoutes');


// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';


// Testing the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection successful!');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });


sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized');
}).catch(error => {
  console.error('Failed to synchronize database:', error);
});




// Importing the User and Course models
const User = require('./models/user');
const Course = require('./models/course');


// Define associations
Course.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Course, { foreignKey: 'userId' });



// Creating the Express app
const app = express();

// Setting up morgan which gives us http request logging
app.use(morgan('dev'));

app.use(express.json()); // Middleware for parsing JSON request bodies






// setting up a global error handler
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




// Using the userRoutes
app.use(userRoutes);
app.use(coursesRoutes);



// Middleware for protecting routes that require authentication
app.use('/api/users', authenticateUser); // Protect /api/users GET
app.use('/api/courses', authenticateUser); // Protect /api/courses POST, PUT, DELETE



// setting up a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});




// Retrieving users along with their associated courses
app.get('/users', async (req, res) => {
  const users = await User.findAll({
    include: [Course],
  });
  res.json(users);
});




// sending 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});





// setting our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
