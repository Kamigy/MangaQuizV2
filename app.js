const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);


// Connectez-vous à MongoDB ici
mongoose.connect('mongodb://127.0.0.1:27017/MangaQuiz', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion :'));
db.once('open', function() {
  console.log("Connecté à MongoDB");
});

// Configuration de body-parser pour traiter les requêtes POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuration de la session
app.use(session({
    secret: 'mario2002',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/MangaQuiz' })
}));

// Servez les fichiers statiques
app.use(express.static(__dirname + '/public'));

// Définissez votre moteur de vue
app.set('view engine', 'ejs');

// Ajoutez vos routeurs
const userRoutes = require('./routes/users');
const quizRoutes = require('./routes/quiz');
const questionsRoutes = require('./routes/questions');
const roomRoutes = require('./routes/room');
app.use('/users', userRoutes);
app.use('/quiz', quizRoutes);
app.use('/questions', questionsRoutes);
app.use('/room', roomRoutes);

const setupSocket = require('./socket');
setupSocket(server);

// Votre route d'accueil
app.get('/', (req, res) => {
  res.render('index'); 
});

// Vos modèles
const User = require('./models/Users');
const Room = require('./models/Room');

// Votre fonction utilitaire
function generateUniqueCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
