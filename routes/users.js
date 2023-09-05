const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
    // Afficher le formulaire d'inscription
    res.send('Page d\'inscription');
});

router.post('/register', (req, res) => {
    // Traitement de l'inscription
    res.send('Inscription en cours...');
});

router.get('/login', (req, res) => {
    // Afficher le formulaire de connexion
    res.send('Page de connexion');
});

router.post('/login', (req, res) => {
    // Traitement de la connexion
    res.send('Connexion en cours...');
});

module.exports = router;
