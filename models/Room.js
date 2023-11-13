const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    code: String,  // code unique du salon pour accéder au quiz
    host: mongoose.Schema.Types.ObjectId, 
    participants: [mongoose.Schema.Types.ObjectId],
    quizId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Room', roomSchema);
