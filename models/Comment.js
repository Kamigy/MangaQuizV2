// models/Comment.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    comment: String,
    date: Date,
    user: {
        type: Schema.Types.ObjectId, // ID de l'utilisateur
        ref: 'User'  
    }
});

module.exports = mongoose.model('Comment', commentSchema);
