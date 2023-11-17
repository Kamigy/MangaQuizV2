const express = require('express');
const router = express.Router();

router.get('/play', (req, res) => {
    res.render('quiz'); // Rendu de quiz.ejs
});

module.exports = router;
