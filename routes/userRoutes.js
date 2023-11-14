const express = require('express');
const router = express.Router();

// Import your User model or any required dependencies here
const User = require('../models/user');

// Middleware for authentication (if needed)

// GET /api/users - Return properties and values for the authenticated user
router.get('/api/users', (req, res) => {
  // You can access the authenticated user data using req.user (assuming you set up authentication middleware)
  const authenticatedUser = req.user;
  res.status(200).json(authenticatedUser);
});

// POST /api/users - Create a new user with validation
router.post('/api/users', (req, res) => {
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
    // Implement user creation logic here if validation passes
    User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      emailAddress: userData.emailAddress,
      password: userData.password,
    })
      .then((user) => {
        // Set the Location header to the root route
        res.location('/');
        // Return a 201 Created status code and no content
        res.status(201).end();
      })
      .catch((err) => {
        // Handle any errors that occur during user creation
        console.error(err);
        res.status(500).json({ message: 'An error occurred during user creation' });
      });
  }
});

module.exports = router;
