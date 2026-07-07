const rateLimit = require('express-rate-limit');

const buildLimiter = ({windowMs, max, message}) => rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({error_msg: message});
  },
});

const loginLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Please try again later.',
});

const registerLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many registration attempts. Please try again later.',
});

module.exports = {
  loginLimiter,
  registerLimiter,
};