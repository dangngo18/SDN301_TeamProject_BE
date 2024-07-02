const express = require('express');
const User = require('../models/User')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authenticate = require('../authenticate/auth');
const config = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const auth = express.Router();//định dạng router
const { sendEmail } = require('../ultis/mailservice')
auth.use(bodyParser.json());



auth.post('/signup', async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            phone: req.body.phone,
            isAcceptMarketing: req.body.isAcceptMarketing ? req.body.isAcceptMarketing : false,
        })
        const existUser = await User.findOne({ email: user.email })

        if (existUser) {
            return res.status(400).send({ message: 'User already exists' })
        }
        await user.save();
        res.status(200).send({ message: 'User created successfully' })
    } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: error });
    }

})


auth.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user với email
        const finduser = await User.findOne({ email: email });

        if (!finduser) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        // So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong cơ sở dữ liệu
        const isMatch = await bcrypt.compare(password, finduser.password);
        console.log('ismatch', isMatch);

        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid email or password.' });
        }

        // Tạo token JWT
        const token = jwt.sign({ id: finduser.userId }, config.secretKey, { expiresIn: '1h' });
        res.send({ token: token ,userId: finduser.userId});
    } catch (error) {
        res.status(500).json({ err: error });
    }
});

auth.post('/requestResetPassword', async (req, res) => {

    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('User with this email does not exist.');
        }

        const otp = crypto.randomInt(100000, 1000000);
        const resetToken = jwt.sign({ email: email, otp: otp }, config.secretKey, { expiresIn: '1h' });

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        await sendEmail(user.email, 'Password Reset OTP', `Your OTP for password reset is: ${otp}`);
        res.status(200).send('OTP sent to your email.');
    } catch (err) {
        console.error('Error in requestResetPassword:', err);
        res.status(500).send('Error sending email.');
    }
})
auth.post('/otp', async (req, res) => {
    const { otp } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: { $ne: null },
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Invalid or expired OTP.');
        }

        const decoded = jwt.verify(user.resetPasswordToken, config.secretKey);
        if (decoded.otp.toString() !== otp.toString()) {
            return res.status(400).send('Invalid OTP.');
        }

        user.isOtpVerified = true; // Set a flag indicating that OTP is verified
        await user.save();

        res.status(200).send('OTP verified.');
    } catch (err) {
        res.status(400).send('Invalid or expired OTP.');
    }
});

auth.post('/resetPassword', async (req, res) => {
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: { $ne: null },
            resetPasswordExpires: { $gt: Date.now() },
            isOtpVerified: true // Ensure that OTP was verified
        });

        if (!user) {
            return res.status(400).send('Invalid or expired OTP.');
        }

        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        user.isOtpVerified = false; // Reset the flag
        await user.save();

        res.status(200).send('Password has been reset.');
    } catch (error) {
        res.status(500).json({ err: error });
    }
});
module.exports = auth;
