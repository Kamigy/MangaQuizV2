const express = require('express');
const router = express.Router();

router.get('/question', (req, res) => {
    Question.aggregate([{ $sample: { size: 1 } }])
        .then(question => {
            res.json(question);
        })
        .catch(err => {
            res.status(500).send(err.message);
        });
});

router.post('/answer', async (req, res) => {
    const { userId, questionId, answerIndex } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
        return res.status(400).send('Question non trouvée');
    }

    if (question.answer !== answerIndex) {
        return res.status(400).send('Réponse incorrecte');
    }

    // Augmenter le score de l'utilisateur s'il répond correctement
    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).send('Utilisateur non trouvé');
    }
    
    user.score += 1;
    await user.save();

    res.send('Réponse correcte et score mis à jour');
});

router.get('/question/:difficulty', (req, res) => {
    const { difficulty } = req.params;
    Question.aggregate([
        { $match: { difficulty: difficulty } },
        { $sample: { size: 1 } }
    ])
    .then(question => {
        res.json(question);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
});

module.exports = router;