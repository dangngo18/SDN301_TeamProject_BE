const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate/auth');
const userController = require('../Controllers/userController');

const UserRoute = express.Router();
UserRoute.use(bodyParser.json());

UserRoute.get('/', authenticate.verify, userController.getAllUsers);
UserRoute.get('/session', userController.getUserSession);
UserRoute.put('/profile/edit/:userId', authenticate.verify, userController.getEditProfile)
UserRoute.get('/:userId', userController.getUserDetail);
UserRoute.put('/func/follow', authenticate.verify, userController.getFollowUser);
// UserRoute.put('/func/save-post/:postId', authenticate.verify, userController.handleSavePost);



module.exports = UserRoute;