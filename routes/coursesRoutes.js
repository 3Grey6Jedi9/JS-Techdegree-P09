const express = require('express');
const router = express.Router();
const authenticateUser = require('../auth')

// Importing the Course and User models and any other required dependencies here
const Course = require('../models/course');
const User = require('../models/user');



// GET /api/courses - Returning all courses with associated users
router.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'], // Exclude createdAt and updatedAt
      },
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





// GET /api/courses/:id - Returning a specific course with associated user
router.get('/api/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await Course.findByPk(courseId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }, // Excluding these fields
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





// POST /api/courses - Creating a new course with validation
router.post('/api/courses', authenticateUser, async (req, res) => {
  // Getting the course data from the request body
  const courseData = req.body;

  // Creating an array to store validation errors
  const errors = [];

  // Validating the required fields
  if (!courseData.title) {
    errors.push('Please provide a value for "title"');
  }

  if (!courseData.description) {
    errors.push('Please provide a value for "description"');
  }

  // Checking if there are any validation errors
  if (errors.length > 0) {
    // Returning a 400 Bad Request status code with the validation errors
    res.status(400).json({ errors });
  } else {
    // Implementing course creation logic here if validation passes
    try {
      const newCourse = await Course.create({
        title: courseData.title,
        description: courseData.description,
        // Other course properties...
        userId: courseData.userId,
      });
      // Setting the Location header to the URI for the newly created course
      res.location(`/api/courses/${newCourse.id}`);
      // Returning a 201 Created status code and no content
      res.status(201).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred during course creation' });
    }
  }
});





// PUT /api/courses/:id - Updating a specific course with validation
router.put('/api/courses/:id', authenticateUser, async (req, res) => {
  const courseId = req.params.id;
  const courseData = req.body;
  const errors = [];

  if (!courseData.title) {
    errors.push('Please provide a value for "title"');
  }

  if (!courseData.description) {
    errors.push('Please provide a value for "description"');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
  } else {
    try {
      const course = await Course.findByPk(courseId);
      if (!course) {
        res.status(404).json({ message: 'Course not found' });
      } else if (course.userId !== req.currentUser.id) { // Checking if the current user is the owner of the course
        res.status(403).json({ message: 'Forbidden: User is not the owner of the course' });
      } else {
        await course.update({
          title: courseData.title,
          description: courseData.description,
        });
        res.status(204).end();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred during course update' });
    }
  }
});



// DELETE /api/courses/:id - Deleting a specific course
router.delete('/api/courses/:id', authenticateUser, async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
    } else if (course.userId !== req.currentUser.id) { // Check if the current user is the owner of the course
      res.status(403).json({ message: 'Forbidden: User is not the owner of the course' });
    } else {
      await course.destroy();
      res.status(204).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during course deletion' });
  }
});





module.exports = router;
