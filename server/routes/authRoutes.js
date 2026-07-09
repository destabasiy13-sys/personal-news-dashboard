const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.getCurrentUser);
router.put('/me', requireAuth, authController.updateProfile);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', requireAuth, authController.resendVerification);

module.exports = router;
