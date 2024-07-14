const express = require('express');
const authController  = require('../Controllers/authController');
const authenticate = require('../authenticate/auth');
const bodyParser = require('body-parser');

const auth = express.Router();//định dạng router
auth.use(bodyParser.json());
auth.post('/signup', authController.signup);
auth.post('/login', authController.login);
auth.post('/requestResetPassword', authController.getResetPass);
auth.post('/otp', authController.getOTP);
auth.post('/resetPassword', authController.resetPass);

module.exports = auth;
