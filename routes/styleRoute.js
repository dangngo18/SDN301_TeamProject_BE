const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bodyparse = require('body-parser');
const authenticate = require('../authenticate/auth');

const styleRoute = router;
styleRoute.use(bodyparse.json());

styleRoute.get('/', async (req, res) => {
    try {
        const posts = await Post.find({});
        if (!posts) {
            return res.status(404).json({message: 'No posts found'});
        } else {
            res.status(200).json(posts);
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error', error: err });
    }
});
styleRoute.get('/posts/user/:id', async (req, res) => {
    try {
        const posts = await Post.find({userId: req.params.id});
        if (!posts) {
            return res.status(404).json({message: 'No posts found'});
        } else {
            res.status(200).json(posts);
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error', error: err });
    }
});
styleRoute.get('/post/:id', async (req, res) => {
    try {
        const post = await Post.findOne({ postId: req.params.id });
        if (!post) return res.status(404).json({ message: 'No post found' });
        res.status(200).json(post);
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error', error: err });
    }
});

module.exports = styleRoute;