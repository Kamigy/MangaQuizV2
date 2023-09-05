// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,  // ne pas stocker le mdp en dur
    score: Number
});

module.exports = mongoose.model('User', userSchema);
