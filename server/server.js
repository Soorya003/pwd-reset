// server.js or app.js
const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('./models/User'); // Your User model
const PasswordResetToken = require('./models/PasswordResetToken'); // Your PasswordResetToken model
const app = express();

app.use(express.json());

// Transporter setup for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dsrsoorya@gmail.com',
        pass: 'Benten2298$',
    },
});

// Request password reset
app.post('/api/request-password-reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Generate a token
        const token = crypto.randomBytes(32).toString('hex');
        const expiry = Date.now() + 3600000; // 1 hour expiry

        // Save token and expiry in the database
        await PasswordResetToken.create({ email, token, expiry });

        // Send email
        const resetLink = `http://localhost:3000/reset-password/${token}`;
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: ${resetLink}`,
        });

        res.status(200).json({ message: 'Password reset email sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
// server.js or app.js
const bcrypt = require('bcrypt');

// Reset password
app.post('/api/reset-password', async (req, res) => {
    const { token, password } = req.body;

    try {
        // Find token in the database
        const resetToken = await PasswordResetToken.findOne({ token });

        if (!resetToken || Date.now() > resetToken.expiry) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Find user and update password
        const user = await User.findOne({ email: resetToken.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        // Remove the token
        await PasswordResetToken.deleteOne({ token });

        res.status(200).json({ message: 'Password has been reset.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});

const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://guvi:guvi@guvi.qgrirnt.mongodb.net/")
  .then(() => {
    console.log("connected to Mongodb");
  });



  const PORT = 3000;
  app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
  });

