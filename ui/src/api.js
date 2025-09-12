/**
 * A wrapper for the fetch API that automatically handles API URLs and authentication tokens.
 */

/**
 * Constructs the full API URL by prepending the base URL from environment variables.
 * In production (e.g., on Netlify), it uses VITE_API_URL.
 * In local development, it falls back to an empty string, making requests relative to the frontend's origin.
 * @param {string} endpoint - The API endpoint (e.g., '/api/user').
 * @returns {string} The full URL for the API request.
 */
const getApiUrl = (endpoint) => {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  return `${apiUrl}${endpoint}`;
};

/**
 * Performs a fetch request with default headers and authentication.
 * @param {string} endpoint - The API endpoint to call (e.g., '/api/login').
 * @param {object} [options={}] - The options for the fetch call (method, body, custom headers, etc.).
 * @returns {Promise<Response>} The fetch Response object.
 */
export const apiFetch = (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  const token = localStorage.getItem('authToken');

  // Set default headers for JSON communication.
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  // Add the Authorization token to the headers if it exists.
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // If a FormData object is being sent, the browser needs to set the
  // Content-Type header automatically, so we remove our default.
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
