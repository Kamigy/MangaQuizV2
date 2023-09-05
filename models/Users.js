// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,  // assurez-vous de ne jamais stocker les mots de passe en clair
    score: Number
});

module.exports = mongoose.model('User', userSchema);
