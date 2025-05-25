const express = require('express')
const { loginController, registerController } = require('../controllers/userController')

//router object
const router = express.Router()

//GET method for login
router.post('/login', loginController)

//GET method for registering
router.post('/register', registerController)


module.exports = router