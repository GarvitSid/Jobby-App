const Joi = require('joi');

const username = Joi.string().trim().min(3).max(30).required();
const password = Joi.string().min(6).max(100).required();

const loginSchema = Joi.object({
  username,
  password,
});

const registerSchema = Joi.object({
  username,
  password,
});

module.exports = {
  loginSchema,
  registerSchema,
};