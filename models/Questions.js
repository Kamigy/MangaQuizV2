// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    answer: Number,  // indice de la réponse correcte dans le tableau 'options'
    difficulty: {
        type: String,
        enum: ['facile', 'moyen', 'difficile'],
        default: 'facile'
    }
});


module.exports = mongoose.model('Question', questionSchema);
