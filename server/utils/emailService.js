import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use the app password if 2-step verification is enabled
    },
});

export const sendPasswordResetEmail = (to, token) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Password Reset',
        text: `Your password reset token is: ${token}. Please use this token to reset your password.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};