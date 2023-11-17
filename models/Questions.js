// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    answer: Number, // ou String, selon comment vous stockez la réponse
    difficulty: String
});



module.exports = mongoose.model('Question', questionSchema);
