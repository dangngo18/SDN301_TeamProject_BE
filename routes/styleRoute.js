const express = require('express');
const router = express.Router();
const bodyparse = require('body-parser');
const authenticate = require('../authenticate/auth');
const styleController = require('../Controllers/styleController');

const styleRoute = router;
styleRoute.use(bodyparse.json());
styleRoute.get('/posts/story/', styleController.getPostStory);
styleRoute.get('/posts/all', styleController.getAllPosts);
styleRoute.get(`/posts/user`, styleController.getPostByUser);
styleRoute.get('/posts/:id', styleController.getPostDetail);

module.exports = styleRoute;