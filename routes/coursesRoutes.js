const express = require('express');
const router = express.Router();

// Import your Course and User models or any required dependencies here
const Course = require('../models/course');
const User = require('../models/user');

// Middleware for authentication (if needed)

// GET /api/courses - Return all courses with associated users
router.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
      },
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching courses' });
  }
});

// GET /api/courses/:id - Return a specific course with associated user
router.get('/api/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await Course.findByPk(courseId, {
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
      },
    });
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
    } else {
      res.status(200).json(course);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the course' });
  }
});



// POST /api/courses - Create a new course with validation
router.post('/api/courses', async (req, res) => {
  // Get the course data from the request body
  const courseData = req.body;

  // Create an array to store validation errors
  const errors = [];

  // Validate the required fields
  if (!courseData.title) {
    errors.push('Please provide a value for "title"');
  }

  if (!courseData.description) {
    errors.push('Please provide a value for "description"');
  }

  // Check if there are any validation errors
  if (errors.length > 0) {
    // Return a 400 Bad Request status code with the validation errors
    res.status(400).json({ errors });
  } else {
    // Implement course creation logic here if validation passes
    try {
      const newCourse = await Course.create({
        title: courseData.title,
        description: courseData.description,
        // Other course properties...
        userId: courseData.userId, // Assuming you have a userId associated with the course
      });
      // Set the Location header to the URI for the newly created course
      res.location(`/api/courses/${newCourse.id}`);
      // Return a 201 Created status code and no content
      res.status(201).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred during course creation' });
    }
  }
});



// PUT /api/courses/:id - Update a specific course with validation
router.put('/api/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  // Get the course data from the request body
  const courseData = req.body;

  // Create an array to store validation errors
  const errors = [];

  // Validate the required fields
  if (!courseData.title) {
    errors.push('Please provide a value for "title"');
  }

  if (!courseData.description) {
    errors.push('Please provide a value for "description"');
  }

  // Check if there are any validation errors
  if (errors.length > 0) {
    // Return a 400 Bad Request status code with the validation errors
    res.status(400).json({ errors });
  } else {
    // Implement course update logic here if validation passes
    try {
      const course = await Course.findByPk(courseId);
      if (!course) {
        res.status(404).json({ message: 'Course not found' });
      } else {
        await course.update({
          // Update course properties using req.body
          title: courseData.title,
          description: courseData.description,
          // Other course properties...
        });
        // Return a 204 HTTP status code and no content
        res.status(204).end();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred during course update' });
    }
  }
});




// DELETE /api/courses/:id - Delete a specific course
router.delete('/api/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  // Implement course deletion logic here
  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
    } else {
      await course.destroy();
      // Return a 204 HTTP status code and no content
      res.status(204).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during course deletion' });
  }
});

module.exports = router;
