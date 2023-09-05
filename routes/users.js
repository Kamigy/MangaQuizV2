const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send('L\'utilisateur existe déjà');
    }

    // Crypter le mot de passe + tard
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashedPassword,
        score: 0
    });

    user.save()
        .then(() => res.send('Inscription réussie'))
        .catch(err => res.status(500).send(err.message));
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).send('Nom d\'utilisateur ou mot de passe incorrect');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send('Nom d\'utilisateur ou mot de passe incorrect');
    }

    // Générer un JWT ou utiliser une session pour garder l'utilisateur connecté
    res.send('Connexion réussie');
});

module.exports = router;
