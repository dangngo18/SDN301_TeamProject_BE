const Post = require('../models/Post');
const User = require('../models/User');
const { checkViewLimit } = require('../middleware/checkViewLimit');

const styleController = {
    getPostStory: async (req, res) => {
        try {
            const posts = await Post.find({ isVisible: true }).sort({ updatedDate: -1 }).limit(6);
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
    },
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.find({ isVisible: true }).sort({ createdDate: -1 });
            if (!posts || posts.length === 0) {
                return res.status(200).json({ message: 'No posts found' });
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
    },
    getAllPostsVideo: async (req, res) => {
        try {
            const posts = await Post.find({ isVisible: true,urlVideo: { $ne: null }  });
            if (!posts || posts.length === 0) {
                return res.status(200).json({ message: 'No posts found' });
            } else {
                const newPost = await Promise.all(posts.map(async (post) => {
                    const user = await User.findOne({ userId: post.userId });
                    return {
                        postId: post.postId,
                        username: post.username,
                        urlVideo: post.urlVideo,
                        title: post.title,
                        content: post.content,
                        likeList: post.likeList,
                        commentList:post.commentList,
                        viewNumber: post.viewNumber,
                        createdDate: post.createdDate,
                        updatedDate: post.updatedDate,
                        saveNumber: post.saveNumber,
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
    },
    getPostByUser: async (req, res) => {
        try {
            const posts = await Post.find({ userId: req.query.userId }).sort({ updatedDate: -1 }).limit(req.query.limit || 0);
            if (!posts) {
                return res.status(404).json({ message: 'No posts found' });
            } else {
                res.status(200).json(posts);
            }
        } catch (err) {
            console.log(err)
            res.status(500).send({ message: 'Server error', error: err });
        }
    },
    getPostDetail: async (req, res) => {
        const isViewValid = checkViewLimit(req, res);
        try {
            const post = await Post.findOne({ postId: req.params.id });
            const user = await User.findOne({ userId: post.userId });
            if (!post) return res.status(404).json({ message: 'No post found' });
            if (isViewValid) {
                post.viewNumber = (post.viewNumber || 0) + 1;
                await post.save();
            }
            res.status(200).json(
                {
                    post,
                    user: {
                        userId: user.userId,
                        username: user.username,
                        profileName: user.profileName,
                        urlImage: user.urlImage,
                    }
                }
            );
        } catch (err) {
            console.log(err)
            res.status(500).send({ message: 'Server error', error: err });
        }
    },
    getUpdateLike: async (req, res) => {
        try {
            const { id } = req.params;
            const user = req.user;
            const post = await Post.findOne({ postId: id });
            if (post.likeList.some((liker) => String(liker.userId) === String(user.userId))) {
                post.likeList = post.likeList.filter((liker) => String(liker.userId) !== String(user.userId));
                await post.save();
                return res.status(200).json({ message: 'Unlike successfully' });
            } else {
                const newUser = {
                    userId: user.userId,
                    username: user.username,
                    profileName: user.profileName,
                    isFollowed: user.following.some((followed) => String(followed.userId) === String(post.userId))
                }
                post.likeList.push(newUser);
                await post.save();
                return res.status(200).json({ message: 'Like successfully' });
            }

        } catch (err) {
            return res.status(500).send({ message: 'Server error', error: err });
        }
    },
    
}
module.exports = styleController