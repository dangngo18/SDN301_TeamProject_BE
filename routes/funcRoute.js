const express = require('express');
const funcRouter = express.Router();
funcRouter.use(express.json());
const User = require('../models/User');

funcRouter.post('/api/validate-username', async (req, res) => {
    const userId  = req.query.userId;
    const user = await User.findOne({userId: userId});
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const recentChanges = user.usernameChangeHistory.filter(change => new Date(change.changedAt) > fourteenDaysAgo);

    if (recentChanges.length >= 2) {
        return res.status(400).json({ message: 'You got over 2 username changes in 14 days.' });
    }

    res.status(200).json({ message: 'valid' });
});

funcRouter.get('/api/usernameIsValid', async (req, res) => {
    const { newUsername, currentUsername } = req.query;
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    
    if (!usernameRegex.test(newUsername)) {
        return res.status(400).json({ message: 'Invalid username. please check your usename again.' });
    }
    
    try {
        const user = await User.findOne({ username: newUsername }).exec();
        
        if (user && user.username !== currentUsername) {
            return res.status(400).json({ message: 'Username is already taken' });
        }
        
        res.status(200).json({ message: 'Username is valid' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

funcRouter.post('/api/validate-profile-name', async (req, res) => {
    const userId  = req.query.userId;

    const user = await User.findOne({userId: userId});
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentChange = user.profileNameChangeHistory.find(change => new Date(change.changedAt) > sevenDaysAgo);

    if (recentChange) {
        return res.status(400).json({ message: 'you got over profile name changes' });
    }

    res.status(200).json({ message: 'Profile name is valid' });
});

module.exports = funcRouter;