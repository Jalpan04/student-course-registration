# Student Course Registration Web Application

A full-stack web application allowing students to register, log in, view available courses, and enroll in them online.

## Output Links

- **Repository**: [Add link here once pushed]
- **Frontend Live**: N/A
- **Backend Live**: N/A

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (Vanilla), DOM API, Fetch API |
| Backend | Node.js, Express.js, JWT (JSON Web Tokens) |
| Database | MongoDB, Mongoose ODM |
| Version Control | Git, GitHub |

## Features

- **User Authentication**: Secure student registration and login with JWT and password hashing (bcrypt).
- **Responsive UI**: Hand-written, minimal CSS with a dark theme and accent colors.
- **Client-Side Validation**: Form validation providing instant feedback to users.
- **Course Dashboard**: Dynamic display of available courses using the Fetch API.
- **Enrollment System**: Prevents duplicate enrollments and respects course capacities.

## Local Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or MongoDB Atlas)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd student-course-registration
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   Ensure there is a `.env` file in the `backend` folder with the following contents:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/student-course-registration
   JWT_SECRET=supersecretjwtkey123
   ```

4. **Start the Backend Server**
   ```bash
   npm start
   ```

5. **Run the Frontend**
   Simply open `frontend/index.html` in your default web browser. You can also use a Live Server extension in VS Code.

## API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new student | Public |
| POST | `/api/auth/login` | Authenticate student & get token | Public |
| GET | `/api/courses` | Get all available courses | Private (JWT) |
| POST | `/api/courses` | Add a new course (Utility for setup) | Public |
| GET | `/api/enrollments` | Get student's enrolled courses | Private (JWT) |
| POST | `/api/enrollments` | Enroll student in a course | Private (JWT) |

## Seed Data Note

You can seed initial courses via Postman or cURL by making a POST request to `http://localhost:5000/api/courses`:

```json
{
  "title": "Introduction to Computer Science",
  "description": "Learn the basics of programming and algorithms.",
  "instructor": "Dr. Smith",
  "credits": 4,
  "schedule": "Mon/Wed 10:00 AM",
  "capacity": 30
}
```
