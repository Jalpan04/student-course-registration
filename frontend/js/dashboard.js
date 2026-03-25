document.addEventListener('DOMContentLoaded', async () => {

  const token = localStorage.getItem('token');
  const studentData = localStorage.getItem('student');

  if (!token || !studentData) {
    window.location.href = 'index.html';
    return;
  }

  const student = JSON.parse(studentData);

  const hour = new Date().getHours();
  let greeting = "Hello";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";
  else if (hour < 21) greeting = "Good Evening";
  else greeting = "Good Night";

  document.getElementById('studentNameDisplay').textContent = `${greeting}, ${student.name}`;

  const alertBox = document.getElementById('dashboardAlert');
  const coursesGrid = document.getElementById('coursesGrid');
  const enrollmentsTableBody = document.getElementById('enrollmentsTableBody');
  const logoutBtn = document.getElementById('logoutBtn');

  let enrolledCourseIds = new Set();

  function showAlert(msg, type = 'success') {
    alertBox.textContent = msg;
    alertBox.className = `alert alert-${type}`;
    alertBox.classList.remove('hidden');
    setTimeout(() => alertBox.classList.add('hidden'), 5000);
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    window.location.href = 'index.html';
  });

  function renderCourses(courses) {
    if (courses.length === 0) {
      coursesGrid.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: var(--text-muted);">No courses available at the moment.</p>';
      return;
    }

    coursesGrid.innerHTML = courses.map(course => {
      const isEnrolled = enrolledCourseIds.has(course._id);
      const isFull = course.enrolled >= course.capacity;

      let btnHtml = '';
      if (isEnrolled) {
        btnHtml = `<button class="btn btn-outline btn-block" disabled>Enrolled</button>`;
      } else if (isFull) {
        btnHtml = `<button class="btn btn-outline btn-block" disabled style="border-color: var(--danger); color: var(--danger);">Course Full</button>`;
      } else {
        btnHtml = `<button class="btn btn-primary btn-block enroll-btn" data-id="${course._id}">Enroll (${course.capacity - course.enrolled} spots left)</button>`;
      }

      return `
        <div class="course-card">
          <h3 class="course-title">${course.title}</h3>
          <p class="course-desc">${course.description}</p>
          <div class="course-meta">
            <div class="meta-item">
              <span class="meta-label">Instructor</span>
              <span>${course.instructor}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Schedule</span>
              <span>${course.schedule}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Credits</span>
              <span>${course.credits}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Capacity</span>
              <span>${course.enrolled}/${course.capacity}</span>
            </div>
          </div>
          ${btnHtml}
        </div>
      `;
    }).join('');

    document.querySelectorAll('.enroll-btn').forEach(btn => {
      btn.addEventListener('click', handleEnrollment);
    });
  }

  function renderEnrollments(enrollments) {
    if (enrollments.length === 0) {
      enrollmentsTableBody.innerHTML = '<tr><td colspan="5" class="text-center" style="color: var(--text-muted);">You haven\'t enrolled in any courses yet.</td></tr>';
      return;
    }

    enrollmentsTableBody.innerHTML = enrollments.map(enrollment => {
      const course = enrollment.course;
      const date = new Date(enrollment.enrolledAt).toLocaleDateString();
      return `
        <tr>
          <td><strong>${course.title}</strong></td>
          <td>${course.instructor}</td>
          <td>${course.schedule}</td>
          <td>${course.credits}</td>
          <td>${date}</td>
        </tr>
      `;
    }).join('');
  }

  async function handleEnrollment(e) {
    const btn = e.target;
    const courseId = btn.getAttribute('data-id');
    const originalText = btn.textContent;

    btn.textContent = 'Enrolling...';
    btn.disabled = true;

    try {
      await API.enrollments.enroll(courseId);
      showAlert('Successfully enrolled in the course!', 'success');

      await loadDashboardData();
    } catch (err) {
      showAlert(err.message, 'danger');
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }

  async function loadDashboardData() {
    try {

      const [courses, enrollments] = await Promise.all([
        API.courses.getAll(),
        API.enrollments.getAll()
      ]);

      enrolledCourseIds = new Set(enrollments.map(e => e.course._id));

      renderEnrollments(enrollments);
      renderCourses(courses);
    } catch (err) {
      if (err.message === 'Token is not valid' || err.message === 'No authentication token found') {
        localStorage.removeItem('token');
        localStorage.removeItem('student');
        window.location.href = 'index.html';
      } else {
        coursesGrid.innerHTML = `<p class="alert alert-danger" style="grid-column: 1 / -1;">Failed to load data: ${err.message}</p>`;
      }
    }
  }

  loadDashboardData();
});
