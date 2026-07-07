const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const errorHandler = require('./middleware/errorHandler');
const { logger, morganStream } = require('./utils/logger');

const app = express();

app.use(helmet());
// Allow credentials so browser can send HttpOnly cookies to API
const allowedOrigins = [
  'http://localhost:5173', // Vite local dev
  process.env.FRONTEND_URL // E.g., 'https://your-jobby-app.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use(morgan('combined', { stream: morganStream }));

app.use(authRoutes);
app.use(jobRoutes);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 2. SPA Fallback: ANYTHING that doesn't match an API route goes to index.html
// Notice we are using /.*/ instead of '*' for Express 5 compatibility
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;