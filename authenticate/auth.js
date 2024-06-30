const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config')

const verify = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            throw new Error('Unauthorized');
        }
        const decoded = jwt.verify(token, config.secretKey);
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