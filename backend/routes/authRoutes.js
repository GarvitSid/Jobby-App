const express = require('express');
const {loginUser, registerUser, logoutUser} = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');
const validateRequest = require('../middleware/validateRequest');
const {loginSchema, registerSchema} = require('../utils/validationSchemas');
const {loginLimiter, registerLimiter} = require('../middleware/rateLimiters');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/login', loginLimiter, validateRequest(loginSchema), asyncHandler(loginUser));
router.post('/register', registerLimiter, validateRequest(registerSchema), asyncHandler(registerUser));
router.post('/logout', authenticateToken, asyncHandler(logoutUser));

module.exports = router;