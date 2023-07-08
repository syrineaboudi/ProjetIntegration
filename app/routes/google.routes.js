const express = require('express');
const router = express.Router();
const authController = require('../controllers/google.controller');

router.get('/', authController.homepage);
router.get('/auth/google', authController.authenticateGoogle);
router.get('/auth/google/callback', authController.handleGoogleCallback);
router.get('/dashboard', authController.dashboard);
router.get('/logout', authController.logout);

module.exports = router;
