document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  const alertBox = loginForm ? document.getElementById('loginAlert') : document.getElementById('registerAlert');

  function showAlert(msg, type = 'danger') {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = `alert alert-${type}`;
    alertBox.classList.remove('hidden');

    setTimeout(() => {
      alertBox.classList.add('hidden');
    }, 5000);
  }

  function showError(inputId, msg) {
    const errorSpan = document.getElementById(`${inputId}Error`);
    const inputEl = document.getElementById(inputId);
    if (errorSpan) errorSpan.textContent = msg;
    if (inputEl) inputEl.classList.add('error-input');
  }

  function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.error-input').forEach(el => el.classList.remove('error-input'));
  }

  if (loginForm) {

    if (localStorage.getItem('token')) {
      window.location.href = 'dashboard.html';
    }

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      let isValid = true;
      if (!email) { showError('email', 'Email is required'); isValid = false; }
      if (!password) { showError('password', 'Password is required'); isValid = false; }

      if (!isValid) return;

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Logging in...';
      submitBtn.disabled = true;

      try {
        const response = await API.auth.login({ email, password });
        localStorage.setItem('token', response.token);
        localStorage.setItem('student', JSON.stringify(response.student));
        showAlert('Login successful! Redirecting...', 'success');

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      } catch (err) {
        showAlert(err.message, 'danger');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  if (registerForm) {

    if (localStorage.getItem('token')) {
      window.location.href = 'dashboard.html';
    }

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      let isValid = true;

      if (!name || name.length < 3) {
        showError('name', 'Name must be at least 3 characters');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
      }

      if (!password || password.length < 8) {
        showError('password', 'Password must be at least 8 characters');
        isValid = false;
      }

      if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
      }

      if (!isValid) return;

      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Creating account...';
      submitBtn.disabled = true;

      try {
        const response = await API.auth.register({ name, email, password });
        showAlert('Registration successful! Redirecting to login...', 'success');

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } catch (err) {
        showAlert(err.message, 'danger');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});
