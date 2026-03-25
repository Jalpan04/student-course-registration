const BASE_URL = 'http://localhost:5000/api';

/**
 * Utility function to handle Fetch API requests with built-in JSON parsing and error throwing.
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Makes a fetch request attaching the JWT token from localStorage
 */
async function authFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  return fetchApi(endpoint, { ...options, headers });
}

// Global API Object
const API = {
  auth: {
    register: (userData) => fetchApi('/auth/register', { method: 'POST', body: userData }),
    login: (credentials) => fetchApi('/auth/login', { method: 'POST', body: credentials }),
  },
  courses: {
    getAll: () => authFetch('/courses', { method: 'GET' }),
  },
  enrollments: {
    getAll: () => authFetch('/enrollments', { method: 'GET' }),
    enroll: (courseId) => authFetch('/enrollments', { method: 'POST', body: { courseId } }),
  }
};
