const express = require('express');
const User = require('../models/User')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authenticate = require('../authenticate/auth');

const UserRoute = express.Router();

UserRoute.use(bodyParser.json());

UserRoute.get('/', authenticate.verify, async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

UserRoute.get('/session', authenticate.verify, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'No posts found' });
        } else {
            res.status(200).json(
                {
                    userId: user.userId,
                    profileName: user.profileName,
                    username: user.username,
                    email: user.email,
                    urlImage: user.urlImage,
                    bio: user.bio,

                    followers: user.followers,
                    following: user.following,
                    address: user.address,
                    phone: user.phone,
                    lastName: user.lastName,
                    firstName: user.firstName,
                    birthday: user.birthday,
                    gender: user.gender
                }
            );
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error', error: err });
    }
});

UserRoute.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: 'Server error' });
    }
});

UserRoute.put('/func/follow/:userId/:isFollow', authenticate.verify, async (req, res) => {
    try {
        const userId = req.user.userId;
        const otherUserId = req.params.userId;
        const thisUser = await User.findOne({ userId: userId });
        const targetUser = await User.findOne({ userId: otherUserId });
        const isFollow = req.params.isFollow;
        if (userId == otherUserId) {
            return res.status(400).send('Cannot follow yourself');
        } else {
            if (!isFollow) {
                const tempUserValue = {
                    userId: targetUser.userId == otherUserId ?? otherUserId,
                    profileName: targetUser.profileName,
                    username: targetUser.username,
                    isFollow: targetUser.followers.includes(userId)
                }
                thisUser.followers.push(tempUserValue);
                await thisUser.save();
                res.status(200).send('followed');
            } else {
                thisUser.followers = thisUser.followers.filter((user) => user.userId !== otherUserId);
                await thisUser.save();
                res.status(200).send('unfollowed');
            }
        }
    } catch (err) {
        res.status(500).send({ message: 'Server error', error: err });
    }
})



module.exports = UserRoute;