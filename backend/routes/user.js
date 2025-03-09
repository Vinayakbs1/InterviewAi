import express from 'express';
import { register, login, logout, getToken, verifyToken } from '../controllers/user.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/getToken', getToken); // Add new route to get token
router.get('/verify-token', isAuthenticated, verifyToken); // Add new route to verify token

export default router;