const express = require('express');
const router = express.Router();

router.get('/play', (req, res) => {
    res.render('quiz'); // Rendu de quiz.ejs
});

router.get('')
module.exports = router;
