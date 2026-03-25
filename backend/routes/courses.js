const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// @route   GET api/courses
// @desc    Get all available courses
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/courses
// @desc    Add a new course (Utility for setup/seed)
// @access  Public
router.post('/', async (req, res) => {
  const { title, description, instructor, credits, schedule, capacity } = req.body;
  
  try {
    const minCap = capacity || 30;
    const newCourse = new Course({
      title,
      description,
      instructor,
      credits,
      schedule,
      capacity: minCap
    });
    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
