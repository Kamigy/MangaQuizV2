const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/Users');
const Comment = require('./models/Comment');
// Configuration de body-parser pour traiter les requêtes POST
const MongoStore = require('connect-mongo');

const app = express();
app.post('/rooms/create', (req, res) => {
  const room = new Room({
      code: generateUniqueCode(), // vous devriez écrire cette fonction
      host: req.session.userId,  // Supposant que l'ID de l'utilisateur est stocké dans la session
      // ... autres propriétés initiales
  });
  room.save().then(() => {
      res.json({ message: 'Salon créé avec succès!', roomCode: room.code });
  });
});


app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index'); 
});

app.use(express.static(__dirname + '/public'));

// Configuration de la session
app.use(session({
    secret: 'mario2002', 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/MangaQuiz' })

}));

app.use(express.json());

// Connexion à MongoDB 
mongoose.connect('mongodb://127.0.0.1:27017/MangaQuiz', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion :'));
db.once('open', function() {
  console.log("Connecté à MongoDB");
});

async function main(){
  const newUser = new User({
    username: "Charco",
    password: "Mario",
    email: "younes@oui.fr",
    score: 0
  })

  const newComment = new Comment({
    comment: "ptdrrr",
    date: new Date(),
    user: "653b5dada216cc34efabff2d"
  })
  //newComment.save()
  //newUser.save()
  //type: mongooose.SchemaTypes.ObjectId
  // schema : User
  //await user.deleteOne(_username = '');
  //Comment.find().populate('user').exec((err, comments) => {
  //});

}

main();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

const userRoutes = require('./routes/users');
const quizRoutes = require('./routes/quiz');
const questionsRoutes = require('./routes/questions');
const roomRoutes = require('.routes/room');

// Routeurs
app.use('/users', userRoutes);
app.use('/quiz', quizRoutes);
app.use('/questions',questionsRoutes);
app.use('/room', roomRoute);

