// userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone_number: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        required: true,
        enum: [0, 1, 2] // 0 - Lowest priority, 1 - Medium priority, 2 - Highest priority
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
