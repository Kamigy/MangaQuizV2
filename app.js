const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

// Configuration de body-parser pour traiter les requêtes POST
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration de la session
app.use(session({
    secret: 'mario2002', // Changez ceci pour une chaîne secrète unique
    resave: false,
    saveUninitialized: false
}));

// Connexion à MongoDB (assurez-vous d'avoir configuré MongoDB comme mentionné précédemment)
mongoose.connect('mongodb://127.0.0.1:27017/MangaQuiz', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion :'));
db.once('open', function() {
  console.log("Connecté à MongoDB");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
//... (autres imports)

const userRoutes = require('./routes/users');
const quizRoutes = require('./routes/quiz');

// Utilisez les routeurs
app.use('/users', userRoutes);
app.use('/quiz', quizRoutes);
