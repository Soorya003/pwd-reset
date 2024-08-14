// models/PasswordResetToken.js
const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiry: { type: Date, required: true },
});

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);
