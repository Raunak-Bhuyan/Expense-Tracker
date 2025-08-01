const express = require('express');
const { loginController, registerController } = require('../controllers/userController');

const router = express.Router();

// Register a new user
router.post('/register', registerController);  // POST /api/users/register

// Login user
router.post('/login', loginController);        // POST /api/users/login

module.exports = router;
