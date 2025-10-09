const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors, splat } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const transportsList = [
  new transports.Console({ level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' })
];

// Only write to files in local development
if (process.env.NODE_ENV !== 'production') {
  transportsList.push(new transports.File({ filename: 'logs/error.log', level: 'error' }));
  transportsList.push(new transports.File({ filename: 'logs/combined.log' }));
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    splat(),
    timestamp(),
    logFormat
  ),
  transports: transportsList,
  exitOnError: false,
});

// morgan-compatible stream
const morganStream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

module.exports = { logger, morganStream };
