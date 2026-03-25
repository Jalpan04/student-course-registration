const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let student = await Student.findOne({ email });

    if (student) {
      return res.status(400).json({ msg: 'Student already exists' });
    }

    student = new Student({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(password, salt);

    await student.save();

    const payload = {
      student: {
        id: student.id,
        name: student.name
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, student: { id: student.id, name: student.name } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      student: {
        id: student.id,
        name: student.name
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, student: { id: student.id, name: student.name } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
