const getApiUrl = (endpoint) => {
  // This uses the VITE_API_URL from Netlify's environment variables in production.
  // In local development, it will be an empty string, so requests are relative (e.g., /api/login).
  const apiUrl = import.meta.env.VITE_API_URL || '';
  return `${apiUrl}${endpoint}`;
};

/**
 * A wrapper around the fetch API that automatically builds the correct URL
 * and adds the Authorization header if a token is present in localStorage.
 * @param {string} endpoint - The API endpoint to call (e.g., '/api/login').
 * @param {object} [options={}] - The options for the fetch call (method, body, etc.).
 * @returns {Promise<Response>} The fetch Response object.
 */
export const apiFetch = (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);

  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
