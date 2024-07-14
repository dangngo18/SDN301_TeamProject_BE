const User = require('../models/User')
const jwt = require('jsonwebtoken');
const Mongoose = require('mongoose');
const userController = {
    getAllUsers: async (req, res) => {
        const users = await User.find({});
        res.status(200).json(users);
    },
    getUserSession: async (req, res) => {
        try {
            const user = await User.findOne({ userId: req.query.userId });
            if (!user) {
                return res.status(404).json({ message: 'No user found' });
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
    },
    getEditProfile: async (req, res) => {
        try {
            const userId = req.params.userId;
            console.log("data form: ", req.body)
            const result = await User.findOneAndUpdate({ userId: userId }, req.body);

            res.status(200).send({ result, message: 'User updated successfully' });
        } catch (error) {
            res.status(500).send({ message: 'Server error' });
        }
    },
    getUserDetail: async (req, res) => {
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
    },
    getFollowUser: async (req, res) => {
        try {
            const userId = req.user.userId;
            const otherUserId = req.query.userId;
            const isFollow = req.query.isFollowed === 'true'; // Convert to boolean
            console.log("first", isFollow)
            if (userId === otherUserId) {
                return res.status(400).send('Cannot follow yourself');
            }

            const thisUser = await User.findOne({ userId: userId });
            const targetUser = await User.findOne({ userId: otherUserId });

            if (!thisUser || !targetUser) {
                return res.status(404).send('User not found');
            }

            if (isFollow) {
                const tempUserValue = {
                    userId: otherUserId,
                    profileName: targetUser.profileName,
                    username: targetUser.username,
                    urlImage: targetUser.urlImage
                };
                const tempOtherUserValue = {
                    userId: userId,
                    profileName: thisUser.profileName,
                    username: thisUser.username,
                    urlImage: thisUser.urlImage,
                    isFollow: targetUser.followers.some((user) => user.userId === userId)
                };
                if (thisUser.followers.some((user) => user.userId == otherUserId)) {
                    const follower = thisUser.followers.find((user) => user.userId == otherUserId);
                    follower.isFollow = true;
                    await thisUser.save();
                }
                if (!thisUser.following.some(user => user.userId === otherUserId)) {
                    thisUser.following.push(tempUserValue);
                    targetUser.followers.push(tempOtherUserValue);
                    await thisUser.save();
                    await targetUser.save();
                    res.status(200).send('followed');
                } else {
                    res.status(400).send('Already following this user');
                }
            } else {
                const previousLength = thisUser.following.length;
                thisUser.following = thisUser.following.filter(user => user.userId + "" !== otherUserId);
                if (thisUser.followers.some((user) => user.userId == otherUserId)) {
                    const follower = thisUser.followers.find((user) => user.userId == otherUserId);
                    follower.isFollow = false;
                    await thisUser.save();
                }
                if (thisUser.following.length !== previousLength) {
                    targetUser.followers = targetUser.followers.filter(follower => follower.userId + "" !== userId + "");
                    await thisUser.save();
                    await targetUser.save();
                    res.status(200).send('unfollowed');
                } else {
                    res.status(400).send('Not following this user');
                }
            }
        } catch (err) {
            res.status(500).send({ message: 'Server error', error: err.message });
        }
    }
}
module.exports = userController;