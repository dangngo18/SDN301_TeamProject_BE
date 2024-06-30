const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure:false,
    auth: {
        user: config.emailUser,
        pass: config.emailPass
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: config.emailUser,
        to: to,
        subject: subject,
        text: text
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                reject(err);
            } else {
                console.log('Email sent:', info.response);
                resolve(info);
            }
        });
    });
};

module.exports = { sendEmail };
