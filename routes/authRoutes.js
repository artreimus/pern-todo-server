import express from 'express';
import loginLimiterMiddleware from '../middlewares/loginLimiter.js';
import {
  register,
  login,
  logout,
  refresh,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginLimiterMiddleware, login);
router.post('/logout', logout);
router.get('/refresh', refresh);

// router.get('/refresh', refresh);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);

export default router;
