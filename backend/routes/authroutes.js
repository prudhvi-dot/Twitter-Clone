import express from 'express';
import { signup,login, logout, getMe } from '../controllers/authcontroller.js';
import { protectRoute } from '../middleware/protected.js';

const router = express.Router();

router.get('/me',protectRoute, getMe);
router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);

export default router;