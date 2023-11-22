const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const authenticateUser = require('../auth')
const User = require('../models/user');
const Sequelize = require('sequelize');



// GET /api/users - Returning properties and values for the authenticated user
// Applying the authenticateUser middleware specifically to this route
router.get('/api/users', authenticateUser, async (req, res) => {
  try {
    const authenticatedUser = req.currentUser;

    if (!authenticatedUser) {
      return res.status(401).json({ message: 'Access Denied' });
    }

    // If authenticatedUser is a Sequelize model instance, it will be converted to plain object
    const userObj = authenticatedUser instanceof Sequelize.Model ? authenticatedUser.get({ plain: true }) : authenticatedUser;

    // Removing sensitive data
    delete userObj.password;
    delete userObj.createdAt;
    delete userObj.updatedAt;

    res.status(200).json(userObj);
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// POST /api/users - Creating a new user with validation
router.post('/api/users', async (req, res) => {
  // Getting the user data from the request body
  const userData = req.body;

  // Creating an array to store validation errors
  const errors = [];

  // Validating the required fields
  if (!userData.firstName) {
    errors.push('Please provide a value for "firstName"');
  }

  if (!userData.lastName) {
    errors.push('Please provide a value for "lastName"');
  }

  if (!userData.emailAddress) {
    errors.push('Please provide a value for "emailAddress"');
  }

  if (!userData.password) {
    errors.push('Please provide a value for "password"');
  }

  // Checking if there are any validation errors
  if (errors.length > 0) {
    // Returning a 400 Bad Request status code with the validation errors
    res.status(400).json({ errors });
  } else {
    try {
      // Generating a hashed password using bcrypt
      const hashedPassword = bcrypt.hashSync(userData.password, 10);

      // Implementing user creation logic here if validation passes
      await User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        emailAddress: userData.emailAddress,
        password: hashedPassword,
      });

      // Setting the Location header to the root route
      res.location('/');
      // Returning a 201 Created status code and no content
      res.status(201).end();
    } catch (err) {
      // Handling any errors that occur during user creation
      console.error(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        // Returning a 400 Bad Request status code with an error message for duplicate email
        res.status(400).json({ message: 'Email address already in use!' });
      } else {
        // Handling other errors with a 500 response
        res.status(500).json({ message: 'An error occurred during user creation' });
      }
    }
  }
});


module.exports = router;
