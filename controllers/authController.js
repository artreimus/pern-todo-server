// const User = require('../models/User');
import jwt from 'jsonwebtoken';
import CustomError from '../error/index.js';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import pool from '../db/index.js';
import bcrypt from 'bcrypt';
import {
  createJWT,
  comparePasswordHash,
  attachCookieToResponse,
  checkCookies,
  createTokenUser,
  // sendResetPasswordEmail,
  createHash,
} from '../utils/index.js';

// @desc Register
// @route POST /auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide all fields');
  }

  const emailAlreadyExist = await pool.query(
    'SELECT * FROM user_app WHERE email = $1',
    [email]
  );

  if (emailAlreadyExist.rows.length) {
    throw new CustomError.ConflictError(
      'Email already taken. Please try another email'
    );
  }

  password = await bcrypt.hash(password, 10);

  const newUser = await pool.query(
    'INSERT INTO user_app (email, password) VALUES($1, $2) RETURNING *',
    [email, password]
  );

  const user = createTokenUser(newUser.rows[0]);

  const accessToken = createJWT(
    { user },
    process.env.ACCESS_TOKEN_SECRET,
    '15m'
  );

  attachCookieToResponse({ res, user });

  // Create list
  const title = `Default list ${user.user_id}`;
  const newList = await pool.query(
    'INSERT INTO list (title, user_id, default_user_list) VALUES($1, $2, $3) RETURNING *',
    [title, user.user_id, true]
  );

  res.status(200).json({
    message: 'Registration successful',
    accessToken,
    defaultList: newList.rows[0],
  });
});

// @desc Login
// @route POST /auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!password | !email) {
    throw new CustomError.BadRequestError('Please provide all fields');
  }

  const foundUser = await pool.query(
    'SELECT * FROM user_app WHERE email = $1',
    [email]
  );

  if (!foundUser.rows.length) {
    throw new CustomError.UnauthorizedError('Invalid credentials');
  }

  const isPasswordCorrect = await comparePasswordHash(
    password,
    foundUser.rows[0].password
  );

  if (!isPasswordCorrect)
    throw new CustomError.UnauthorizedError('Invalid credentials');

  const user = createTokenUser(foundUser.rows[0]);

  const accessToken = createJWT(
    { user },
    process.env.ACCESS_TOKEN_SECRET,
    '15m'
  );

  attachCookieToResponse({ res, user });
  res.status(200).json({
    message: 'Login successful',
    user_id: user.user_id,
    email: user.email,
    accessToken,
  });
});

// @desc Refresh Token
// @route GET /auth/refresh
// @access Public - because token has expired
const refresh = asyncHandler(async (req, res) => {
  const cookies = checkCookies(req);
  const refreshToken = cookies.refreshToken;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err)
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'Invalid token' });

      const foundUser = await pool.query(
        'SELECT * FROM user_app WHERE user_id = $1',
        [decoded.user.user_id]
      );

      if (!foundUser.rows.length) {
        throw new CustomError.UnauthorizedError('Invalid token. Please login');
      }

      const user = createTokenUser(foundUser.rows[0]);
      const accessToken = createJWT(
        { user },
        process.env.ACCESS_TOKEN_SECRET,
        '15m'
      );

      res
        .status(200)
        .json({ accessToken, user_id: user.user_id, email: user.email });
    })
  );
});

// @desc Logout
// @route GET /auth/logout
// @access Public - just to clearn cookie if exists
const logout = asyncHandler(async (req, res) => {
  checkCookies(req);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });
  res.status(200).json({ message: 'Cookie successfully cleared' });
});

// @desc Forgot Password
// @route {POST} /auth/forgot-password
// @access Public
// const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     throw new CustomError.BadRequestError('Please provide a valid email');
//   }

//   const user = await User.findOne({ email });

//   if (user) {
//     const passwordToken = crypto.randomBytes(70).toString('hex');

//     const origin = 'http://localhost:5173';

//     await sendResetPasswordEmail({
//       name: user.username,
//       email: user.email,
//       token: passwordToken,
//       origin,
//     });

//     const expirationDate = 1000 * 60 * 60 * 24; // 24 hours
//     const passwordTokenExpirationDate = new Date(Date.now() + expirationDate);
//     user.passwordToken = createHash(passwordToken);
//     user.passwordTokenExpirationDate = passwordTokenExpirationDate;
//     await user.save();
//   }

//   res.status(StatusCodes.OK).json({
//     message:
//       'Please check your email for the reset password instructions. If you cannot find the email please check the spam folder',
//   });
// });

// @desc Reset Password
// @route {POST} /auth/reset-password
// @access Public
// const resetPassword = asyncHandler(async (req, res) => {
//   const { token, email, password } = req.body;

//   if (!token || !email || !password) {
//     throw new CustomError.BadRequestError('Please provide all fields');
//   }

//   const user = await User.findOne({ email });

//   if (user) {
//     const currentDate = new Date();

//     if (user.passwordTokenExpirationDate < currentDate) {
//       throw new CustomError.BadRequestError(
//         'Password request link has expired. Please try again'
//       );
//     }

//     if (user.passwordToken === createHash(token)) {
//       user.password = password;
//       user.passwordToken = null;
//       user.passwordTokenExpirationDate = null;
//       await user.save();
//     }
//   }

//   res.status(StatusCodes.OK).json({ message: 'Password reset successful' });
// });

export {
  register,
  login,
  refresh,
  logout,
  // forgotPassword, resetPassword
};
