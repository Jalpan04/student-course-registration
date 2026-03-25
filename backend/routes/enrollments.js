const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// @route   POST api/enrollments
// @desc    Enroll a student in a course
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.student.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ msg: 'Already enrolled in this course' });
    }

    // Check capacity
    if (course.enrolled >= course.capacity) {
      return res.status(400).json({ msg: 'Course is full' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: studentId,
      course: courseId
    });

    await enrollment.save();

    // Update course enrolled count
    course.enrolled += 1;
    await course.save();

    // Populate course details to return
    await enrollment.populate('course');

    res.json(enrollment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/enrollments
// @desc    Get all courses a student is enrolled in
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const studentId = req.student.id;
    const enrollments = await Enrollment.find({ student: studentId }).populate('course');
    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
