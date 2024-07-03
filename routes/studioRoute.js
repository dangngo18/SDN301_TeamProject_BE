const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bodyparse = require('body-parser');
const authenticate = require('../authenticate/auth');

const studioRoute = router;
studioRoute.use(bodyparse.json());

studioRoute.get('/posts', authenticate.verify, async (req, res) => {
    try {
        const userId = req.user.userId;
        const posts = await Post.find({ userId: userId });
        if (!posts) {
            return res.status(404).json({ message: 'No posts found' });
        } else {
            res.status(200).json(posts);
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error', error: err });
    }
})
studioRoute.get('/posts/:id',authenticate.verify, async (req, res) => {
    try {
        const post = await Post.findOne({ postId: req.params.id });
        if (!post) return res.status(404).json({ message: 'No post found' });
        res.status(200).json(post);
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error', error: err });
    }
}).put('/posts/:id', authenticate.verify, async (req, res) => {
    try {
        const post = await Post.findOne({ postId: req.params.id });
        if (!post) return res.status(404).json({ message: 'No post found' });
        post.title = req.body.title;
        post.content = req.body.content;
        post.productTags = req.body.productTags
        post.image = req.body.image
        post.urlVideo = req.body.image.length > 0 ?  null : req.body.urlVideo

        await post.save();
        res.status(200).send('success.');
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error', error: err });
    }
}).put('/posts/archive/:id', authenticate.verify, async (req, res) => {
    try {
        const post = await Post.findOne({ postId: req.params.id });
        if (!post) return res.status(404).json({ message: 'No post found' });
        post.isVisible = req.body.isVisible;
        await post.save();
        res.status(200).send('success.');
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error', error: err });
    }
})
studioRoute.post('/upload', authenticate.verify, async (req, res) => {
    try {
        const post = new Post({
            userId: req.user.userId,
            username: req.user.username,
            title: req.body.title,
            content: req.body.content,
            productTags: req.body.productTags,
            image: req.body.image,
            urlVideo: req.body.image.length > 0 ? null : req.body.urlVideo
        })

        await post.save();
        res.status(200).send('success');
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error', error: err });
    }
})

module.exports = studioRoute;