// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String, 
    score: Number
});

module.exports = mongoose.model('User', userSchema);
