const express = require('express');
const router = express.Router();
const bodyparse = require('body-parser');
const authenticate = require('../authenticate/auth');
const studioController = require('../Controllers/studioController');

const studioRoute = router;
studioRoute.use(bodyparse.json());

studioRoute.get('/posts', authenticate.verify, studioController.getAllPosts)
studioRoute.get('/posts/:id',authenticate.verify, studioController.getPostById)
.put('/posts/:id', authenticate.verify, studioController.getUpdatePost)
.put('/posts/archive/:id', authenticate.verify, studioController.getArchivePost)
studioRoute.post('/upload', authenticate.verify, studioController.getPostUpload)

module.exports = studioRoute;