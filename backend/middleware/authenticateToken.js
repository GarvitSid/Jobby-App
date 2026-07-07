const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// Helper to parse cookie header string into an object
const parseCookies = cookieHeader => {
  const cookies = {};
  if (!cookieHeader) return cookies;
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    cookies[key] = decodeURIComponent(val);
  }
  return cookies;
};

const authenticateToken = (req, res, next) => {
  let jwtToken;
  const authHeader = req.headers['authorization'];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]; // "Bearer TOKEN" -> "TOKEN"
  }

  // Fallback: check cookies (useful when token is sent as HttpOnly cookie)
  if (!jwtToken) {
    const cookies = parseCookies(req.headers.cookie);
    if (cookies.jwt_token) jwtToken = cookies.jwt_token;
  }

  if (jwtToken === undefined) {
    return next(new AppError('Invalid JWT Token', 401));
  }

  jwt.verify(jwtToken, process.env.JWT_SECRET, (error, payload) => {
    if (error) {
      return next(new AppError('Invalid JWT Token', 401));
    }
    // If token is valid, attach username to the request and continue
    req.username = payload.username;
    next();
  });
};

module.exports = authenticateToken;