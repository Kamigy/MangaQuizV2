const express = require('express');
const router = express.Router();

router.get('/create-room', (req, res) => {
    // Afficher la page de création de salon
    res.send('Page de création de salon');
});

router.post('/create-room', (req, res) => {
    // Traitement de la création de salon
    res.send('Création de salon...');
});

router.get('/room/:id', (req, res) => {
    // Afficher le quiz pour le salon donné (id)
    res.send('Page du quiz pour le salon ' + req.params.id);
});

router.post('/room/:id/submit', (req, res) => {
    // Traitement des réponses du quiz
    res.send('Soumission des réponses...');
});

module.exports = router;
