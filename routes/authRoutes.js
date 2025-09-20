const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth, requireGuest } = require('../middleware/auth');

const router = express.Router();

// Guest routes (require user to NOT be authenticated)
router.get('/register', requireGuest, authController.showRegister);
router.post('/register', requireGuest, authController.register);
router.get('/login', requireGuest, authController.showLogin);
router.post('/login', requireGuest, authController.login);

// Protected routes (require user to be authenticated)
router.get('/dashboard', requireAuth, authController.showDashboard);
router.get('/profile', requireAuth, authController.showProfile);
router.post('/profile', requireAuth, authController.updateProfile);
router.post('/logout', requireAuth, authController.logout);
router.get('/logout', requireAuth, authController.logout); // Allow GET for convenience

module.exports = router;
