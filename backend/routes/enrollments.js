const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.student.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ msg: 'Already enrolled in this course' });
    }

    if (course.enrolled >= course.capacity) {
      return res.status(400).json({ msg: 'Course is full' });
    }

    const enrollment = new Enrollment({
      student: studentId,
      course: courseId
    });

    await enrollment.save();

    course.enrolled += 1;
    await course.save();

    await enrollment.populate('course');

    res.json(enrollment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const studentId = req.student.id;
    const enrollments = await Enrollment.find({ student: studentId }).populate('course');
    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
