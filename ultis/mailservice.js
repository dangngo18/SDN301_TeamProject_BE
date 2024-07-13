const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure:false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
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

// const fs = require('fs');
// const path = require('path');
// const { google } = require('googleapis');
// require('dotenv').config();

// const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
// const TOKEN_PATH = path.join(__dirname, 'token.json');

// // Load client secrets from a local file.
// const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

// function loadCredentials() {
//     return new Promise((resolve, reject) => {
//         fs.readFile(CREDENTIALS_PATH, (err, content) => {
//             if (err) return reject('Error loading client secret file:', err);
//             resolve(JSON.parse(content));
//         });
//     });
// }

// async function authorize() {
//     const credentials = await loadCredentials();
//     const { client_secret, client_id, redirect_uris } = credentials.web;
//     const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
//     console.log(credentials.web) 
//     console.log(oAuth2Client) 

//     let token;
//     try {
//         token = fs.readFileSync(TOKEN_PATH);
//         oAuth2Client.setCredentials(JSON.parse(token));
//     } catch (error) {
//         token = await getAccessToken(oAuth2Client);
//         fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
//     }
//     return oAuth2Client;
// }

// function getAccessToken(oAuth2Client) {
//     const authUrl = oAuth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: SCOPES,
//     });
//     console.log('Authorize this app by visiting this url:', authUrl);

//     return new Promise((resolve, reject) => {
//         const readline = require('readline');
//         const rl = readline.createInterface({
//             input: process.stdin,
//             output: process.stdout,
//         });
//         rl.question('Enter the code from that page here: ', (code) => {
//             rl.close();
//             oAuth2Client.getToken(code, (err, token) => {
//                 if (err) return reject('Error retrieving access token', err);
//                 oAuth2Client.setCredentials(token);
//                 resolve(token);
//             });
//         });
//     });
// }

// async function sendEmail(to, subject, text) {
//     const auth = await authorize();
//     const gmail = google.gmail({ version: 'v1', auth });

//     const messageParts = [
//         `From: <${process.env.EMAIL_USER}>`,
//         `To: <${to}>`,
//         `Subject: ${subject}`,
//         '',
//         text,
//     ];
//     const message = messageParts.join('\n');

//     const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

//     const res = await gmail.users.messages.send({
//         userId: 'me',
//         requestBody: {
//             raw: encodedMessage,
//         },
//     });
//     console.log('Email sent:', res.data);
// }

// module.exports = { sendEmail };