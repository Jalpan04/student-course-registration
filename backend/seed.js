const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Course.deleteMany();

    const dummyCourses = [
      {
        title: 'Introduction to Web Development',
        description: 'Learn the basics of HTML, CSS, and modern web design principles to build responsive websites.',
        instructor: 'Dr. Sarah Johnson',
        credits: 3,
        schedule: 'Mon/Wed 10:00 AM - 11:30 AM',
        capacity: 40
      },
      {
        title: 'Advanced JavaScript Concepts',
        description: 'Deep dive into closures, async/await, prototype chain, and advanced design patterns.',
        instructor: 'Prof. Mark Williams',
        credits: 4,
        schedule: 'Tue/Thu 2:00 PM - 3:30 PM',
        capacity: 35
      },
      {
        title: 'Full-Stack React & Node',
        description: 'Build complete applications using the MERN stack. Includes RESTful APIs and state management.',
        instructor: 'Elena Rodriguez',
        credits: 4,
        schedule: 'Mon/Wed/Fri 1:00 PM - 2:00 PM',
        capacity: 30
      },
      {
        title: 'Database Systems & SQL',
        description: 'Relational database design, normal forms, and complex SQL queries.',
        instructor: 'Dr. James Chen',
        credits: 3,
        schedule: 'Tue/Thu 9:00 AM - 10:30 AM',
        capacity: 45
      },
      {
        title: 'Cloud Computing Fundamentals',
        description: 'Introduction to AWS, Azure, and Google Cloud Platform services and deployment strategies.',
        instructor: 'Kevin Smith',
        credits: 3,
        schedule: 'Online / Asynchronous',
        capacity: 50
      },
      {
        title: 'Machine Learning Basics',
        description: 'Introduction to supervised and unsupervised learning algorithms using Python.',
        instructor: 'Dr. Alan Turing',
        credits: 4,
        schedule: 'Mon/Wed 4:00 PM - 5:30 PM',
        capacity: 25
      },
      {
        title: 'UI/UX Design Principles',
        description: 'Wireframing, prototyping, user testing, and accessibility basics for creating beautiful and usable interfaces.',
        instructor: 'Jessica Wong',
        credits: 3,
        schedule: 'Tue/Thu 11:00 AM - 12:30 PM',
        capacity: 30
      },
      {
        title: 'Cybersecurity Fundamentals',
        description: 'Introduction to network security, cryptography, common vulnerabilities, and secure coding practices.',
        instructor: 'Alex Mercer',
        credits: 3,
        schedule: 'Friday 9:00 AM - 12:00 PM',
        capacity: 40
      }
    ];

    await Course.insertMany(dummyCourses);
    console.log('Dummy courses seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

seedCourses();
