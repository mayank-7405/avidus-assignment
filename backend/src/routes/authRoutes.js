const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Jab koi in endpoints par POST request bhejega, toh wo functions chalenge
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;