const AppError = require('../utils/AppError');

const validateRequest = schema => (req, res, next) => {
  const {error, value} = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map(item => item.message).join(', ');
    return next(new AppError(message, 400));
  }

  req.body = value;
  return next();
};

module.exports = validateRequest;