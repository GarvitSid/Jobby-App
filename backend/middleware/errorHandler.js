const { logger } = require('../utils/logger');

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map(item => item.message).join(', ');
  }

  if (error.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(error.keyValue || {})[0];
    message = duplicateField ? `${duplicateField} already exists` : 'Duplicate value found';
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier';
  }

  // Log the full error for diagnostics
  logger.error(error);

  return res.status(statusCode).json({error_msg: message});
};

module.exports = errorHandler;