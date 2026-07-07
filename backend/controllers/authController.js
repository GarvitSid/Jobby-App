const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const AppError = require('../utils/AppError');

const createToken = username => jwt.sign({username}, process.env.JWT_SECRET, {
  // Shorten token lifetime to 1 day for better security
  expiresIn: '1d',
});

const registerUser = async (req, res, next) => {
  const {username, password} = req.body;

  const existingUser = await User.findOne({username});
  if (existingUser) {
    return next(new AppError('Username already exists', 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({username, password: hashedPassword});
  await Profile.findOneAndUpdate(
    {username},
    {
      $setOnInsert: {username},
    },
    {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
    },
  );

  return res.status(201).json({message: 'User created successfully'});
};

const loginUser = async (req, res, next) => {
  const {username, password} = req.body;

  const user = await User.findOne({username});
  if (!user) {
    return next(new AppError('Invalid username', 404));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new AppError('Invalid password', 400));
  }

  const token = createToken(username);
  // Send token as HttpOnly cookie to mitigate XSS token theft
  res.cookie('jwt_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return res.json({message: 'Login successful'});
};

const logoutUser = async (req, res) => {
  res.clearCookie('jwt_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return res.json({message: 'Logout successful'});
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};