const express = require('express');
const funcRouter = express.Router();
funcRouter.use(express.json());
const funcController = require('../Controllers/funcController');
funcRouter.post('/api/validate-username', funcController.validateUsername);
funcRouter.get('/api/usernameIsValid', funcController.usernameIsValid);
funcRouter.post('/api/validate-profile-name', funcController.validateProfileName);

module.exports = funcRouter;