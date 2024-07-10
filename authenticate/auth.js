const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const verify = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            res.status(401).send('Unauthorized');
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ userId: decoded.id });
        if (!user) {
            throw new Error('User not found');
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
};



module.exports = {verify};