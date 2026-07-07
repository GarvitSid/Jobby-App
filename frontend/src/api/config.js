// In production (on Render), use relative paths ('') so it automatically uses the same domain.
// In local development, fall back to the local backend port.
const API_BASE_URL = import.meta.env.PROD 
  ? '' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

export default API_BASE_URL
