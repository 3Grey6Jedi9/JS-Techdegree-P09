const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

// Import your User model or any required dependencies here
const User = require('../models/user');



// GET /api/users - Return properties and values for the authenticated user
router.get('/api/users', (req, res) => {
  // You can access the authenticated user data using req.user (assuming you set up authentication middleware)
  const authenticatedUser = req.user;

  if (!authenticatedUser) {
    res.status(401).json({ message: 'Access Denied' });
  } else {
    // Check if the properties exist before attempting to delete them
    if (authenticatedUser.hasOwnProperty('password')) {
      delete authenticatedUser.password;
    }

    if (authenticatedUser.hasOwnProperty('createdAt')) {
      delete authenticatedUser.createdAt;
    }

    if (authenticatedUser.hasOwnProperty('updatedAt')) {
      delete authenticatedUser.updatedAt;
    }

    res.status(200).json(authenticatedUser);
  }
});




// POST /api/users - Create a new user with validation
router.post('/api/users', async (req, res) => {
  // Get the user data from the request body
  const userData = req.body;

  // Create an array to store validation errors
  const errors = [];

  // Validate the required fields
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

  // Check if there are any validation errors
  if (errors.length > 0) {
    // Return a 400 Bad Request status code with the validation errors
    res.status(400).json({ errors });
  } else {
    try {
      // Generate a hashed password using bcrypt
      const hashedPassword = bcrypt.hashSync(userData.password, 10);

      // Implement user creation logic here if validation passes
      await User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        emailAddress: userData.emailAddress,
        password: hashedPassword,
      });

      // Set the Location header to the root route
      res.location('/');
      // Return a 201 Created status code and no content
      res.status(201).end();
    } catch (err) {
      // Handle any errors that occur during user creation
      console.error(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        // Return a 400 Bad Request status code with an error message for duplicate email
        res.status(400).json({ message: 'Email address already in use!' });
      } else {
        // Handle other errors with a 500 response
        res.status(500).json({ message: 'An error occurred during user creation' });
      }
    }
  }
});


module.exports = router;
