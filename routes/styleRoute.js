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
            return res.status(404).json({ message: 'No posts found' });
        } else {
            res.status(200).json(posts);
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error', error: err });
    }
});
styleRoute.get('/posts/story/', async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ updatedDate: -1 }).limit(6);
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        } else {
            const newPost = await Promise.all(posts.map(async (post) => {
                const user = await User.findOne({ userId: post.userId });
                return {
                    postId: post.postId,
                    image: post.image,
                    urlVideo: post.urlVideo,
                    user: {
                        urlImage: user.urlImage && user.urlImage !== "" ? user.urlImage : "https://i.ibb.co/chpHF6x/No-Image-User.png",
                        username: user.username,
                    }
                };
            }));
            res.status(200).json(newPost);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error', error: err });
    }
});
styleRoute.get('/posts/user/:id', async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.id });
        if (!posts) {
            return res.status(404).json({ message: 'No posts found' });
        } else {
            res.status(200).json(posts);
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error', error: err });
    }
});
styleRoute.get('/posts/user/:id/:limit', async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.id }).limit(req.params.limit);
        if (!posts) {
            return res.status(404).json({ message: 'No posts found' });
        } else {
            res.status(200).json(posts);
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error', error: err });
    }
});
styleRoute.get('/posts/all', async (req, res) => {
    try {
        const posts = await Post.find({userId: "668241eca8ce04f38572aa7f"}).sort({ createdDate: -1 });
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        } else {
            const newPost = await Promise.all(posts.map(async (post) => {
                const user = await User.findOne({ userId: post.userId });
                return {
                    postId: post.postId,
                    image: post.image,
                    urlVideo: post.urlVideo,
                    title: post.title,
                    content: post.content,
                    likeList: post.likeList,
                    viewNumber: post.viewNumber,
                    createdDate: post.createdDate,
                    updatedDate: post.updatedDate,
                    isVisible: post.isVisible,
                    user: {
                        userId: user.userId,
                        urlImage: user.urlImage && user.urlImage !== "" ? user.urlImage : "https://i.ibb.co/chpHF6x/No-Image-User.png",
                        profileName: user.profileName
                    }
                };
            }));
            res.status(200).json(newPost);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error', error: err });
    }
});
styleRoute.get('/post/:id', async (req, res) => {
    try {
        const post = await Post.findOne({ postId: req.params.id });
        const user = await User.findOne({ userId: post.userId });
        if (!post) return res.status(404).json({ message: 'No post found' });
        res.status(200).json(
            {
                post,
                user:{
                    userId: user.userId,
                    username:user.username,
                    profileName:user.profileName,
                    urlImage: user.urlImage,
                }
            }
        );
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Server error', error: err });
    }
});

module.exports = styleRoute;