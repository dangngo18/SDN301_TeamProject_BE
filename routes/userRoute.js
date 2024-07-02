const express = require('express');
const User = require('../models/User')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authenticate = require('../authenticate/auth');

const UserRoute = express.Router();

UserRoute.use(bodyParser.json());

UserRoute.get('/', authenticate.verify, async(req,res)=>{
    const users = await User.find({});
    res.status(200).json(users);
})

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


module.exports = UserRoute;